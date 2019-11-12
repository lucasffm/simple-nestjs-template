#!/bin/sh
for s in $( cat ecosystem.json | strip-json-comments | jq -r '.apps[0].env|@text' | jq -r 'to_entries|map("\(.key)=\(.value|tostring)")|.[]' );
    do echo $s >> .env.teste;
done;