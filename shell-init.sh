#!/bin/bash

FAT_CYAN="\[\e[1;36m\]"
GIT_YELLOW="\[\e[0;33m\]"
NORMAL="\[\e[m\]"
PS1="${FAT_CYAN}Service B${NORMAL}$GIT_YELLOW"'$(__git_ps1 " (%s)")'" $FAT_CYAN$ $NORMAL"

