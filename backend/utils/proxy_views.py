import logging
from urllib.parse import urlparse

import requests
from django.conf import settings
from django.http import JsonResponse, HttpResponse, StreamingHttpResponse
from django.views.decorators.http import require_http_methods

logger = logging.getLogger(__name__)

DEFAULT_TIMEOUT = getattr(settings, "WEB_CONSOLE_PROXY_TIMEOUT", 10)
ALLOWED_PROXY_HOSTS = getattr(settings, "WEB_CONSOLE_PROXY_ALLOWLIST", [
    "www.google.com",
    "google.com",
    "cursor.com",
    "www.cursor.com",
    "sites.google.com",
    "localhost",
    "127.0.0.1",
    "0.0.0.0",
])
STRIP_HEADERS = {
    "x-frame-options",
    "content-security-policy",
    "content-security-policy-report-only",
    "strict-transport-security",
    "clear-site-data",
    "cross-origin-opener-policy",
    "cross-origin-embedder-policy",
    "cross-origin-resource-policy",
}


@require_http_methods(["GET"])
def proxy_web_content(request):
    target = request.GET.get("target", "").strip()
    if not target:
        return JsonResponse({"detail": "Missing 'target' query parameter."}, status=400)

    parsed = urlparse(target if "://" in target else f"https://{target}")
    if parsed.scheme not in {"http", "https"}:
        return JsonResponse({"detail": "Only http/https URLs are supported."}, status=400)

    hostname = parsed.hostname or ""
    if hostname.lower() not in [host.lower() for host in ALLOWED_PROXY_HOSTS]:
        return JsonResponse({"detail": "Domain is not allowed for proxying."}, status=403)

    try:
        headers = {
            "User-Agent": "RetailWebConsoleProxy/1.0",
            "Accept": request.META.get("HTTP_ACCEPT", "text/html,application/xhtml+xml"),
            "Accept-Language": request.META.get("HTTP_ACCEPT_LANGUAGE", "en-US,en;q=0.9"),
        }
        upstream = requests.get(
            parsed.geturl(),
            headers=headers,
            stream=True,
            timeout=DEFAULT_TIMEOUT,
            allow_redirects=True,
        )
    except requests.RequestException as exc:
        logger.warning("Proxy request failed for %s: %s", parsed.geturl(), exc)
        return JsonResponse({"detail": "Failed to retrieve the requested resource."}, status=502)

    content_type = upstream.headers.get("Content-Type")
    should_inject_base = content_type and "text/html" in content_type.lower()

    if should_inject_base:
        try:
            upstream.encoding = upstream.encoding or "utf-8"
            html = upstream.text
            base_tag = f'<base href="{parsed.scheme}://{parsed.netloc}/">'
            lower_html = html.lower()
            insert_index = lower_html.find("<head")
            if insert_index != -1:
                head_close_index = lower_html.find(">", insert_index)
                if head_close_index != -1:
                    head_close_index += 1
                    html = html[:head_close_index] + base_tag + html[head_close_index:]
            content = html.encode(upstream.encoding or "utf-8", errors="replace")
        except Exception as exc:
            logger.warning("Failed to inject base tag for %s: %s", parsed.geturl(), exc)
            content = upstream.content
        finally:
            upstream.close()
        response = HttpResponse(content, status=upstream.status_code)
    else:
        def stream_content():
            try:
                for chunk in upstream.iter_content(chunk_size=8192):
                    if chunk:
                        yield chunk
            finally:
                upstream.close()
        response = StreamingHttpResponse(stream_content(), status=upstream.status_code)

    if content_type:
        response["Content-Type"] = content_type

    for header, value in upstream.headers.items():
        header_lower = header.lower()
        if header_lower in STRIP_HEADERS:
            continue
        if header_lower.startswith("access-control-"):
            continue
        if header_lower in {"content-length", "transfer-encoding", "content-encoding"}:
            continue
        response[header] = value

    response["Cache-Control"] = "no-store"
    return response
