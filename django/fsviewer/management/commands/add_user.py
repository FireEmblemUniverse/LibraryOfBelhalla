
from django.core.management.base import BaseCommand, CommandError

from fsviewer.models import DocOwner

class Command(BaseCommand):
    def add_arguments(self, parser):
        parser.add_argument('name', type=str, help='User to add.')
        parser.add_argument('dir', type=str, help='Path for user.')

    def handle(self, *args, **opts):
        result = DocOwner.objects.create(name=opts['name'], root=opts['dir'])
        result.clean()
        result.save()

