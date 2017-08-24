#!/usr/bin/python3

import sys, os
import atexit
import tempfile as tf

PIPE_DIR = '/var/belhalla'

def do_pull(user):
    cwd = os.getcwd()
    os.chdir(os.path.join(cwd, user))
    os.system('git pull')
    os.chdir(cwd)

def do_create(user, rpath):
    os.system(f'git clone {rpath} {user}')

def process(line):
    if not line: return
    cmd, *args = line.split()
    try:
        if cmd == 'refresh': do_pull(*args)
        elif cmd == 'init': do_create(*args)
        # Do nothing
        else: return
    except TypeError:
        return

def belhalla(pipe):
    global FIFO
    FIFO = pipe
    os.mkfifo(pipe)

    with open(PIPE_LOC, 'w') as f: f.write(FIFO)

    for line in notify_loop():
        process(line)

def notify_loop(fname=None):
    if fname is None: fname = FIFO
    # This is necessary due to a quirk with Unix FIFO pipes; writing to the
    # pipe will send an EOF (no more input) after each write. Thus, to keep the
    # pipe open while blocking, we have to reopen it every time.
    while True:
        with open(fname) as f:
            yield f.read()

@atexit.register
def clean():
    try:
        os.unlink(FIFO)
        os.remove(PIPE_LOC)
    except:
        # Can't do anything about this
        pass

if __name__ == '__main__':
    if len(sys.argv) < 2: belhalla(os.environ['BELHALLA_PIPE'])
    else: belhalla(sys.argv[1])

