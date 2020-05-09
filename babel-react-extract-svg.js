const writeSvgFiles = {}
const writeJsFiles = {}
const SVG_TARGET_LOCATION = "./src/assets/icons"
const JS_TARGET_LOCATION = "./src/assets/generated-icons"
const SVG_RELATIVE_IMPORT_PATH = "../icons"

const fs = require("fs")

const capitalize = (s) => {
    if (typeof s !== "string") {
        return ""
    }
    return s.charAt(0).toUpperCase() + s.slice(1)
}

const saveFile = (a, b, c) => {
    console.log("Save:", a)
    fs.writeFile(a, b, c)
}

module.exports = function (_ref) {
    // const t = _ref.types;
    return {
        pre(state) {
            const fileName = state.opts.filename
            const splitFileName = fileName.split("/")
            const originalFileName = splitFileName[splitFileName.length - 1]
            writeJsFiles[fileName] = {
                location: `${JS_TARGET_LOCATION}/${originalFileName}`,
                imports: ["import React from \"react\""],
                variables: [],
            }
            writeSvgFiles[fileName] = []
            console.log("Prepare", fileName)

        },
        post(state) {
            const fileName = state.opts.filename
            console.log("Finished ", fileName, "LOADING. Creating svgs: ", writeSvgFiles[fileName].length)
            writeSvgFiles[fileName].forEach((svgData) => {
                saveFile(svgData.location, svgData.content, function (err) {
                    if (err) {
                        console.error(err)
                        return
                    }
                })
            })
            const jsData = writeJsFiles[fileName]
            saveFile(jsData.location, [
                jsData.imports.sort().join("\n"),
                "",
                jsData.variables.sort().join("\n\n")].join("\n")
                , function (err) {
                    if (err) {
                        console.error(err)
                        return
                    }
                })
        },
        visitor: {
            // Program: { exit(path, state) { /* Add code here that runs after file finished. */} },
            Function: {
                enter(path, state) {
                    const fileName = state.file.opts.filename
                    const splitFileName = fileName.split("/")
                    const originalFileName = splitFileName[splitFileName.length - 1]
                    const variableName = path.parent.id.name
                    const svgContent = path.hub.file.code.slice(path.node.body.start, path.node.body.end)
                    // example cases that can occur
                        .replace(/width=\{.*\}/g, "")
                        .replace(/height=\{.*\}/g, "")
                        .replace(/\{\/\*/g, "<!--")
                        .replace(/\*\/\}/g, "-->")
                        // .replace("viewBox", "viewBox")
                        // .replace("preserveAspectRatio", "preserveAspectRatio")
                        .replace(/className/g, "class")
                        .replace(/fillRule/g, "fill-rule")
                        .replace(/xlinkHref/g, "xlink:href")
                        .replace(/strokeWidth/g, "stroke-width")
                        .replace(/strokeMiterlimit/g, "stroke-miterlimit")
                        .replace(/strokeDasharray/g, "stroke-dasharray")
                        .replace(/strokeLinecap/g, "stroke-linecap")
                        .replace(/enableBackground/g, "enable-background")
                        .replace(/fontFamily/g, "font-family")
                        .replace(/fontSize/g, "font-size")
                        .replace(/textAnchor/g, "text-anchor")
                        .replace(/\n[ ]{4}/g, "\n")

                    writeSvgFiles[fileName].push({
                        location: `${SVG_TARGET_LOCATION}/${variableName}.svg`,
                        content: svgContent,
                    })
                    const svgComponentName = capitalize(variableName)
                    writeJsFiles[fileName].imports
                        .push(`import { ReactComponent as ${svgComponentName} } from "${SVG_RELATIVE_IMPORT_PATH}/${variableName}.svg"`)
                    writeJsFiles[fileName].variables
                        .push(`export const ${variableName} = (width, height) => (<${svgComponentName} width={width} height={height} />)`)
                    console.log(" - ", originalFileName, variableName)
                }
            }
        }
    }
}