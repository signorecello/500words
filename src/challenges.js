export const challenges = [
    {
        name: "Speedy",
        alias: "speedy",
        description: `
            Keep writing in less than ${process.env[`REACT_APP_SPEEDY_MAX_TIME${process.env.REACT_APP_ENVIRONMENT}`] / 60} 
            minutes for ${process.env[`REACT_APP_SPEEDY_STREAK${process.env.REACT_APP_ENVIRONMENT}`]} times to earn this badge. 
            This will make you flow your ideas without judging too much`,
        thumbnail: require("./images/rabbit.png"),
        card: require("./images/rabbit_card.png")
    },
    {
        name: "Thinker",
        alias: "thinker",
        description: `
            "I can think, I can fast, I can wait". Follow Sidhhartha's teachings and win this achievement. Keep a
            ${process.env[`REACT_APP_THINKER_STREAK${process.env.REACT_APP_ENVIRONMENT}`]}-day streak writing 
            with a total time above ${process.env[`REACT_APP_THINKER_MIN_TIME${process.env.REACT_APP_ENVIRONMENT}`] / 60} minutes`,        
        thumbnail: require("./images/buddha.png"),
        card: require("./images/buddha_card.jpg")
    },
    {
        name: "Longest strain",
        alias: "longest",
        description: `
            Persistence goes a long way! Earn this achievement when you write ${process.env[`REACT_APP_MINIMUM_WORDS${process.env.REACT_APP_ENVIRONMENT}`]} words 
            each day for ${process.env[`REACT_APP_LONGEST_ACHIEVEMENT_VALUE${process.env.REACT_APP_ENVIRONMENT}`]} days`,
        thumbnail: require("./images/calendar.png"),
        card: require("./images/calendar_card.png")
    
    },
    {
        name: "No breath",
        alias: "nobreath",
        description: `
            No time to catch your breath! As long as you keep a ${process.env[`REACT_APP_NO_BREATH_STREAK${process.env.REACT_APP_ENVIRONMENT}`]}-day streak 
            writing with less than ${process.env[`REACT_APP_MAX_PAUSE_LIMIT_SECS${process.env.REACT_APP_ENVIRONMENT}`]} seconds pause, this badge is all yours`,        
        thumbnail: require("./images/fountain-pen.png"),
        card: require("./images/fountain_card.jpg")
    },
    {
        name: "Writer",
        alias: "writer",
        description: "Seems like you've become a writer! Write your first text submission and win this little achievement",
        thumbnail: require("./images/write.png"),
        card: require("./images/write_card.jpg")
    
    },
    // {
    //     name: "Artist",
    //     description: "Oh, we have an artist out there! Submit your first sketch and win this achievement",
    //     thumbnail: require("./images/draw.png"),
    //     card: require("./images/draw_card.jpg")
    // },
    {
        name: "Photographer",
        alias: "photographer",
        description: "Seems like you've become a photographer! Submit your first picture and win this badge!",
        thumbnail: require("./images/camera.png"),
        card: require("./images/camera_card.jpg")
    
    }
]
