const puppeteer = require('puppeteer');

(async () => {
    try{

        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        await page.setViewport({width:1920,height:1080});

        //go to addUser.html and click addUser
        await page.goto('http://localhost:3001');
    
        await page.screenshot({path: 'example.png'});

        //shutdown
        await browser.close();

    }catch(e){
        console.log(e);

    }
})();