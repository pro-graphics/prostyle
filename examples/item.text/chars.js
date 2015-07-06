var chars = Pro.Motion.Stories.chars = Pro.Motion.Stories.chars || {};

chars.story = {
    items:[
        {
            setup:{text:"CHARACTER ANIMATION"},
            charInit:{
                font:26,
                color:"rgba(0,63,127,0.7)",
                position:{z:12},
                origin:[0,8,-6]
            },
            charAction:{
                anim:{dur:4, stagger:0.12, repeat:7, ease:"curve inout", yoyo:true},
                rotation:{x:720}
            }
        },
        {
            itemType:"image",
            setup:{src:"sep.svg", width:90},
            init:{pos:{z:5}}
        }
    ]
};
