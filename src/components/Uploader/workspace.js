var JSZip = require("jszip");

export default class Workspace
{
    constructor()
    {
        this.isReady = false;


    }

    updateFolders()
    {
        this.images = this.zip.folder("images");
        this.settings = this.zip.folder("settings");
        this.layouts = this.zip.folder("layouts");
        this.styles = this.zip.folder("styles");
        this.sets = this.zip.folder("sets");
    }

    createWorkspace(file, callback)
    {
        this.zip = new JSZip();

        this.updateFolders();
    }

    loadWorkspace(file, callback)
    {
        this.zip = new JSZip();

        this.isReady = false;

        this.zip.loadAsync(file)
        .then(zipped =>
        {
            this.isReady = true;
            
            this.updateFolders();

            if (callback)
            {
                callback();
            }
        });
    }
    
    saveWorkspace(callback)
    {
        if (!this.isReady)
        {
            return;
        }

        this.zip.generateAsync({type:"blob"})
        .then(callback);
    }

    download(projectName)
    {
        this.saveWorkspace(blob =>
        {
            var a = document.createElement("a");
            var url = window.URL.createObjectURL(blob);

            a.setAttribute("href", url);
            a.download = projectName + ".zip";
            a.click();

            window.URL.revokeObjectURL(url);
            a.remove();
        });
    }
}