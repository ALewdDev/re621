/**
 * Replaces the variables in the provided string with those from the package.json
 * @param {*} input String to process
 */


const getBuildTime = () => {
    function twoDigit(n) { return (n < 10 ? '0' : '') + n; }

    const date = new Date();
    return (date.getFullYear() + "").substring(2) + twoDigit(date.getMonth() + 1) + twoDigit(date.getDate()) + ":" + twoDigit(date.getHours()) + twoDigit(date.getMinutes());
};


module.exports = { getBuildTime ,

    // /**
    //  * Returns the current time, in YYMMDD:HHMM format
    //  */
    // getBuildTime() {
    //     function twoDigit(n) { return (n < 10 ? '0' : '') + n; }
    //
    //     const date = new Date();
    //     return (date.getFullYear() + "").substring(2) + twoDigit(date.getMonth() + 1) + twoDigit(date.getDate()) + ":" + twoDigit(date.getHours()) + twoDigit(date.getMinutes());
    // },

    /**
     * Replaces the variables in the provided string with those from the package.json
     * @param {*} input String to process
     * @param {*} package package.json
     */
    parseTemplate(input, package) {
        // const version = process.env.GIT_TAG_NAME === undefined ? package.version : process.env.GIT_TAG_NAME;
        const version = process.env.GIT_TAG_NAME === undefined ? package.version.substring(0, package.version.lastIndexOf(".")) + ".dev0" : process.env.GIT_TAG_NAME;
        return input
            .replace(/%NAME%/g, package.name)
            .replace(/%DISPLAYNAME%/g, package.displayName)
            .replace(/%NAMESPACE%/g, package.namespace)
            .replace(/%DESCRIPTION%/g, package.description)
            .replace(/%AUTHOR%/g, package.author)
            .replace(/%VERSION%/g, version.split("-")[0].replace(/[^.0-9]/g,'').padEnd(1,'0'))
            .replace(/%VERSIONNAME%/g, version.split("-")[0])
            .replace(/%VERSIONREPO%/, version)
            .replace(/%VERSHORT%/g, package.version.replace(/\.\d+$/g, ""))
            .replace(/%BUILD%/g, getBuildTime())
            .replace(/%HOMEPAGE%/g, package.homepage)
            .replace(/%GITHUB%/g, package.github)
            .replace(/%SUPPORT%/g, package.bugs.url)
            .replace(/%HOMEPAGE%/g, package.homepage);
    },

}
