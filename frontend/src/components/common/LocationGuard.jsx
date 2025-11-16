import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';

// Debug switch - Set to 'true' to enable detailed debugging logs
const DEBUG_MODE = false;

/**
 * LocationGuard Component
 * 
 * Redirects admin/backoffice users to location selection page if:
 * - They are admin/backoffice role
 * - No location has been selected for this session
 * - Not already on the location selection page
 * 
 * POS users (posuser, posmanager) always use their assigned location and skip this check.
 */
const LocationGuard = () => {
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const location = useLocation();
  const [needsLocationSelection, setNeedsLocationSelection] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    if (DEBUG_MODE) {
      console.log('🛡️ LocationGuard: Checking location requirements...');
      console.log('👤 LocationGuard: User:', user?.username, 'Role:', user?.role);
      console.log('🔐 LocationGuard: Authenticated:', isAuthenticated);
      console.log('📍 LocationGuard: Current path:', location.pathname);
    }

    // If not authenticated, allow access (PrivateRoute will handle redirect)
    if (!isAuthenticated || !user) {
      if (DEBUG_MODE) console.log('⏭️ LocationGuard: Not authenticated, allowing access');
      setChecking(false);
      setNeedsLocationSelection(false);
      return;
    }

    try {
      // Roles that need location selection
      const locationSelectionRoles = ['admin', 'superuser', 'backofficemanager', 'backofficeuser'];
      const userRole = user?.role || '';
      const isSuperuser = user?.is_superuser;
      const userNeedsSelection = isSuperuser || locationSelectionRoles.includes(userRole);

      if (DEBUG_MODE) {
        console.log('🔍 LocationGuard: Role check:', { userRole, isSuperuser, userNeedsSelection });
      }

      if (!userNeedsSelection) {
        // POS users use their assigned location - no selection needed
        if (DEBUG_MODE) console.log('⏭️ LocationGuard: User does not need location selection');
        setNeedsLocationSelection(false);
        setChecking(false);
        return;
      }

      // Check if location already selected in this session
      const sessionLocation = localStorage.getItem('session_location_id');
      const sessionSkipped = localStorage.getItem('session_location_skipped');
      const sessionLocationName = localStorage.getItem('session_location_name');
      const sessionLocationSelectedAt = localStorage.getItem('session_location_selected_at');

      if (DEBUG_MODE) {
        console.log('💾 LocationGuard: Session check:', {
          sessionLocation,
          sessionLocationName,
          sessionSkipped,
          sessionLocationSelectedAt
        });
      }

      // If location selected or skipped, allow access
      if (sessionLocation || sessionSkipped) {
        if (DEBUG_MODE) console.log('✅ LocationGuard: Location already selected or skipped, allowing access');
        setNeedsLocationSelection(false);
      } else {
        // Needs location selection
        if (DEBUG_MODE) console.log('⚠️ LocationGuard: No location selected, redirecting to location selection');
        setNeedsLocationSelection(true);
      }

      setChecking(false);
    } catch (error) {
      console.error('❌ LocationGuard error:', error);
      // On error, allow access to prevent blocking
      setNeedsLocationSelection(false);
      setChecking(false);
    }
  }, [user, isAuthenticated, location.pathname]);

  // Always allow access to location selection page itself
  if (location.pathname === '/location-selection') {
    return <Outlet />;
  }

  // Always allow POS routes - POS users don't need location selection
  // POS routes handle their own session/location requirements
  const isPOSRoute = location.pathname === '/pos' || 
                     location.pathname === '/pos/' || 
                     location.pathname.startsWith('/pos/');
  if (isPOSRoute) {
    return <Outlet />;
  }

  // If not authenticated, allow access (PrivateRoute will handle redirect)
  // Also allow during checking to prevent blank screen
  if (!isAuthenticated || !user || checking) {
    return <Outlet />;
  }

  // Only redirect if we're certain the user needs location selection
  // AND we're not already on that page (double-check)
  // AND we're not coming from the location selection page (to prevent loops)
  if (needsLocationSelection && location.pathname !== '/location-selection') {
    if (DEBUG_MODE) console.log('🔄 LocationGuard: Redirecting to location selection from:', location.pathname);
    return <Navigate to="/location-selection" replace />;
  }

  // Allow access in all other cases
  return <Outlet />;
};

export default LocationGuard;
