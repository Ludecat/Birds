define(['../../sharedConstants'], function (Const) {

    return (
        [
            {
                nightSrc: 'images/night.png',
                width: 500,
                height: 768,
                posY: 0,
                speed: Const.LEVEL_SPEED / 4,
                repeat: true
            },
            {
                daySrc: 'images/sonne.png',
                nightSrc: 'images/mond.png',
                width: 1000,
                height: 114,
                posY: 50,
                speed: Const.LEVEL_SPEED / 50,
                repeat: true
            },
            {
                daySrc: 'images/clouds.png',
                nightSrc: 'images/night_clouds.png',
                width: 300,
                height: 256,
                posY: 416,
                speed: Const.LEVEL_SPEED / 3,
                repeat: true
            },
            {
                daySrc: 'images/city2.png',
                nightSrc: 'images/night-city_3.png',
                width: 300,
                height: 256,
                posY: 416,
                speed: Const.LEVEL_SPEED / 2,
                repeat: true
            },
            {
                daySrc: 'images/trees.png',
                nightSrc: 'images/night-trees.png',
                width: 300,
                height: 216,
                posY: 480, //456
                speed: Const.LEVEL_SPEED,
                repeat: true
            }
        ]);
});