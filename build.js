import {build} from "esbuild";

build({
    entryPoints: ["src/space.ts"],
    bundle: true,
    //minify: true,
    platform: "browser",
    outfile: "dist/space.js"
});