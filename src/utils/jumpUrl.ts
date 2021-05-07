export const getHref = (contryId: number) => {
    let srcObj = {}
    switch(contryId){
        case 1:
            srcObj= {
                im: "https://usa.ingrammicro.com/Site/Search#keywords:", 
                grainger: "https://www.grainger.com/search?searchBar=true&searchQuery=", 
                inracom: "https://portal.icintracom.com/shop?order=&search=", 
                Tw: "https://www.twhouse.com/?s=", 
            }
            break;
        case 2:
            srcObj= {
                im: "https://uk-new.ingrammicro.com/Site/Search#keywords:", 
                grainger: "https://www.grainger.com/search?searchBar=true&searchQuery=", 
                inracom: "https://portal.icintracom.com/shop?order=&search=", 
                Tw: "https://www.twhouse.com/?s=", 
            }
            break;
    }
    return srcObj
}

export const getTargetHref = (venderId: number | string) => {
    let srcObj = {
        1: "https://usa.ingrammicro.com/Site/Search#keywords:", 
                2: "https://www.grainger.com/search?searchBar=true&searchQuery=", 
                3: "https://portal.icintracom.com/shop?order=&search=", 
                4: "https://uk-new.ingrammicro.com/Site/Search#keywords:", 
                5: "https://www.twhouse.com/?s=", 
    }
    return srcObj[venderId]
}

export const getAsonHref = (contryId: number) => {
    let jumpUrl = "https://www.amazon.com/dp/"
    if(contryId ===2){
        jumpUrl = 'https://www.amazon.co.uk/dp/'
    }
    return jumpUrl
}

export const getNewEggHref = (newEggId: string) => {
    return `https://www.newegg.com/p/pl?d=${newEggId}`
}