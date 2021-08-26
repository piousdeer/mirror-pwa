#!/bin/bash
for SIZE in 192 512; do
  inkscape -z -w $SIZE -h $SIZE vector.svg -o $SIZE.png
  inkscape -z -w $SIZE -h $SIZE vector-maskable.svg -o $SIZE-maskable.png
done
