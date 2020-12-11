#!/bin/bash

gnome-terminal -x sh -c "sh serve-model.sh" --working-directory="${pwd}"
gnome-terminal -x sh -c "sh serve-flask.sh" --working-directory="${pwd}"