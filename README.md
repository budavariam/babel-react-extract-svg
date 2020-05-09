# Babel React Extract SVG

A quick proof of concept babel plugin that refactors a react codebase
to extract inline svg as separate svg files.

Main inspiration: I learned that you can
[import svg files as components](https://create-react-app.dev/docs/adding-images-fonts-and-files#adding-svgs)
with create-react-app.

## Getting started

```bash
yarn
yarn run svg-extract
```

## Expected structure

It expects that the icons are loccated in a certain folder.
The icons are js filles that contain svg assets as function components.
More assets can be stored in a single file.

```js
import React from "react"

export const logo = ({ width, height }) => (
    <svg width={width} height={height} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 841.9 595.3">
        <g fill="#61DAFB">
            <circle cx="420.9" cy="296.5" r="45.7" />
        </g>
    </svg>
)
```

## Generated structure

It extracts the top level svg components from these kind of js files,
and saves them to a separate place.

For project backward compatibility it keeps the file structure,
and the variables to export.

I think it is better to export them here,
if any extra logic needed they can manipulate props in these js files.

```js
import React from "react"
import { ReactComponent as Logo } from "../icons/logo.svg"

export const logo = (width, height) => (<Logo width={width} height={height} />)
```

> NOTE: This plugin is meant to be run only one time,
> while refactoring code to this approach from the previous one.

## Disclaimer

This is my fist ever babel plugin.
This code is not prepared for any kind of case, I made it to have some fun.

I just wanted to try if babel can save me many hours of
repetitive copy/paste file creation, function renaming work.
I'm happy that it worked exactly as I wanted it to be.

It should not do anything desctructive, but I'm sure
it won't work for the first time in any repository that has different constrains.
