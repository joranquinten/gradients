const sharp = require("sharp");


const days = (year) => {
    const startDate = new Date(`01/01/${year}`)
    const endDate = new Date(`01/01/${year+1}`)

    const diffTime = Math.abs(endDate - startDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
    return diffDays;
}

const generateBigImage = async (colorArray) => {
    const fs = require('fs')
    const { createCanvas } = require('canvas')
    const lineHeight = 5;

    const width = 1200
    const height = colorArray.length * 5

    const canvas = createCanvas(width, height)
    const context = canvas.getContext('2d')

    // draw the lines from the Array
    colorArray.forEach((color, index) => {
        context.fillStyle = `rgb(${color.r}, ${color.g}, ${color.b})`;
        context.fillRect(0, index * lineHeight, width, lineHeight)
    })
    const buffer = canvas.toBuffer('image/png')
    await fs.writeFileSync('./output/test.png', buffer)

}

const generateImage = async (filename, size, background) => {
    const { r, g, b } = background;
    return await sharp({
        create: {
            width: size.width,
            height: size.height,
            channels: 3,
            background: { r, g, b },
            },
        })
        .jpeg()
        .toFile(`./output/${filename}.jpg`);
};

const generator = async () => {
    const year = 2022;
    const totalDays = days(year);

    console.log(`Generating year ${year}: ${totalDays} days`)

    let colorArray = [];
    for (let i = 0; i <= totalDays; i++) {
        const percentage = (i / totalDays * 100)
        const percentageRounded = Math.round((percentage + Number.EPSILON) * 100) / 100;

        const decimalToRgb = (decimal) => ({ 
            r: (decimal >> 16) & 0xff, 
            g: (decimal >> 8) & 0xff,
            b: decimal & 0xff,
        });

        const decimal = Math.ceil((16777215 * (percentage/100)));
        const background = decimalToRgb(decimal)

        console.log(`day${i}`, percentageRounded, decimal, background)
        colorArray.push(background);
        //await generateImage(`day-${i}`, { width: 100, height: 100 }, background );
    }

    await generateBigImage(colorArray)


}

generator();