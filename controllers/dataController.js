const {ProjectPage} = require("../models/db")


exports.CheckData = async (topic,value)=>{
    try{
        var notification = null;
        const projectPages = await ProjectPage.findAll()
        projectPages.forEach((element) => {
            if(element.droppedItems.length!==0){
                element.droppedItems.forEach(item=>{
                    if(item.type==="CHART" && item.settings.data_name===topic.split("/")[0]){
                        
                        const minLimit =parseInt(item.settings.minLimit);
                        const maxLimit = parseInt(item.settings.maxLimit);
                        if (parseInt(value)<minLimit || parseInt(value) >maxLimit){
                            console.log("notification sent for "+topic)
                            notification = {success:false, notification:("notification", topic+" not in range : value "+value+" should be between "+minLimit+" and "+maxLimit+".")}
                            return
                        }
                    }
                })
            }
            if (notification) return
        });
        return notification
    }catch(err){
        console.log(err)
        return notification
    }
}