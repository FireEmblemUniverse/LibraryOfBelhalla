from django import template
from django.core.urlresolvers import reverse

register = template.Library()

def make_link(tag):
    return '<a href="{0}">{1}</a>'.format(
        reverse('tag_index', kwargs={'slug':tag.slug}), tag.slug
    )

@register.filter
def linklist(tags):
    return ', '.join(map(make_link, tags))
