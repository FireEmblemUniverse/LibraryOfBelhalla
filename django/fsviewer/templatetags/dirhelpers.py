import os

from django import template

register = template.Library()

@register.filter
def pathjoin(value, arg):
    return os.path.join(value, arg)
