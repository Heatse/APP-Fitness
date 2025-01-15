const COLORS = {
    primary: '#BBF246', //xanh chuối
    primaryDark: '#038700', // xanh chuối đậm
    secondary: '2563EB', // xanh dương
    secondaryLight: '#DBEAFE', // xanh dương nhạt
    white: '#fff', // trắng
    text: '#192126', // đen
    extradark: '#575E65', // xám đậm
    bgColor: '#F5F5F5', // trắng ngà
    gray: '#EBEBEB', // xám
    grayDark: '#CFCFCF', // xám đậm
    yellow: '#FFF500', // vàng,
    native: '#E47043', // cam
}

const FONT = {
    thin: 'Poppins_Thin', //100
    extralight: 'Poppins_ExtraLight', //200
    light: 'Poppins_Light', // 300
    regular: 'Poppins_Regular', // 400
    medium: 'Poppins_Mediu', // 500
    semibold: 'Poppins_SemiBold', // 600
    bold: 'Poppins_Bold', // 700
    extrabold: 'Poppins_ExtraBold', // 800
    black: 'Poppins_Black', // 900

    thinI: 'Poppins_ThinItalic', //100
    extralightI: 'Poppins_ExtraLightItalic', //200
    lightI: 'Poppins_LightItalic', // 300
    regularI: 'Poppins_RegularItalic', // 400
    mediumI: 'Poppins_MediuItalic', // 500
    semiboldI: 'Poppins_SemiBoldItalic', // 600
    boldI: 'Poppins_BoldItalic', // 700
    extraboldI: 'Poppins_ExtraBoldItalic', // 800
    blackI: 'Poppins_BlackItalic', // 900
}

const SIZES = {
    small: 10, //note
    smallX: 12, // body2
    medium: 14, // body1
    mediumX: 16, // title 3
    large: 20, // title 2,
    largeX: 24, // title 1
    h2: 32, // h2
    h1: 40, // h1
}

const SHADOWS = {
    android: {
        elevation: 4,
    },
    ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
    },
    all: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 4,
    },
}

export { COLORS, FONT, SIZES, SHADOWS }
