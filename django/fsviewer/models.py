from django.db import models

class DocOwner(models.Model):
    name = models.CharField(max_length=200)
    root = models.FilePathField(path="/home", recursive=True)

