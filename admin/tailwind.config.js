/** @type {import ('tailwindcss').config} */
export default {
    content:[
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme:{
        extend:{
            colors:{
                'primary':"#5F6FFF"
            }
        },
    },
    plugins:[],
}