import uuid
from django.conf import settings
from django.db import migrations, models


def seed_settlement_reasons(apps, schema_editor):
    SettlementReason = apps.get_model('pos_masters', 'SettlementReason')
    reasons = [
        {
            'code': 'SHORT',
            'name': 'Cash Shortage',
            'reason_type': 'shortage',
            'module_ref': 'POS_OPERATOR_CASHUP',
            'app_ref': 'POS_APP',
            'description': 'Variance recorded when counted cash is less than expected.',
        },
        {
            'code': 'EXCESS',
            'name': 'Cash Excess',
            'reason_type': 'excess',
            'module_ref': 'POS_OPERATOR_CASHUP',
            'app_ref': 'POS_APP',
            'description': 'Variance recorded when counted cash is more than expected.',
        },
    ]

    for reason in reasons:
        SettlementReason.objects.update_or_create(
            code=reason['code'],
            defaults=reason,
        )


def remove_settlement_reasons(apps, schema_editor):
    SettlementReason = apps.get_model('pos_masters', 'SettlementReason')
    SettlementReason.objects.filter(code__in=['SHORT', 'EXCESS']).delete()


class Migration(migrations.Migration):

    dependencies = [
        ('pos_masters', '0005_add_sale_types'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='SettlementReason',
            fields=[
                ('id', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ('code', models.CharField(help_text='Unique reason code (e.g., SHORT)', max_length=20, unique=True)),
                ('name', models.CharField(help_text='Display name for the reason', max_length=120)),
                ('reason_type', models.CharField(choices=[('shortage', 'Shortage'), ('excess', 'Excess'), ('other', 'Other')], help_text='Reason category', max_length=20)),
                ('module_ref', models.CharField(help_text="Module reference (e.g., 'POS_OPERATOR_CASHUP')", max_length=100)),
                ('app_ref', models.CharField(blank=True, help_text="Application reference (e.g., 'POS_APP')", max_length=100)),
                ('description', models.TextField(blank=True, help_text='Optional description for additional context')),
                ('is_active', models.BooleanField(default=True)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('created_by', models.ForeignKey(blank=True, null=True, on_delete=models.SET_NULL, related_name='settlement_reasons_created', to=settings.AUTH_USER_MODEL)),
                ('updated_by', models.ForeignKey(blank=True, null=True, on_delete=models.SET_NULL, related_name='settlement_reasons_updated', to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'verbose_name': 'Settlement Reason',
                'verbose_name_plural': 'Settlement Reasons',
                'db_table': 'pos_settlement_reasons',
                'ordering': ['reason_type', 'name'],
            },
        ),
        migrations.AddIndex(
            model_name='settlementreason',
            index=models.Index(fields=['reason_type', 'is_active'], name='pos_settle_reason_active_idx'),
        ),
        migrations.AddIndex(
            model_name='settlementreason',
            index=models.Index(fields=['module_ref'], name='pos_settle_module_ref_idx'),
        ),
        migrations.RunPython(seed_settlement_reasons, reverse_code=remove_settlement_reasons),
    ]

