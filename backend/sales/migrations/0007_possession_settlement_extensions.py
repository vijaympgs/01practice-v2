from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('pos_masters', '0006_settlementreason'),
        ('sales', '0006_add_terminal_location_to_possession'),
    ]

    operations = [
        migrations.AddField(
            model_name='possession',
            name='base_expected_cash',
            field=models.DecimalField(blank=True, decimal_places=2, help_text='Baseline expected cash before interim settlements', max_digits=10, null=True),
        ),
        migrations.AddField(
            model_name='possession',
            name='interim_settlements',
            field=models.JSONField(blank=True, default=list, help_text='Snapshots of interim settlements captured during the session'),
        ),
        migrations.AddField(
            model_name='possession',
            name='total_counted_cash',
            field=models.DecimalField(blank=True, decimal_places=2, help_text='Total counted cash including interim settlements', max_digits=10, null=True),
        ),
        migrations.AddField(
            model_name='possession',
            name='variance_reason',
            field=models.ForeignKey(blank=True, help_text='Variance reason selected during final settlement', null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='pos_sessions', to='pos_masters.settlementreason'),
        ),
    ]

