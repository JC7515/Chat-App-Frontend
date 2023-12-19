import { bodyCookieOptions, cookiesZerializerForEachProps, cookiesZerializerProps } from '@/components/types'
import cookie from 'cookie'

export const GetCookieValue = (cookieKey: string) => {

    const documentCookie: any = document.cookie

    const value = documentCookie
        .split('; ')
        .find((cookie: string) => cookie.startsWith(`${cookieKey}=`))
        .split('=')[1]

    return value
}


export const CookieSerializer = (listOfcookies: any, cookieOptions: bodyCookieOptions) => {
    listOfcookies.forEach((cookieElem: cookiesZerializerForEachProps) => {
        document.cookie = cookie.serialize(cookieElem.name, cookieElem.value, cookieOptions)
    })
}



export const ConvertDateToHourFormat = (creationDateOfMessage: Date) => {
    // const dateOfCreation = new Date(creationDateOfMessage) 
    const hour = creationDateOfMessage.getHours()
    const minutes = creationDateOfMessage.getMinutes()
    const formattedHour = hour % 12 || 12;

    const CreationHourOfMessage = `at ${formattedHour}:${minutes}${hour >= 12 ? ' PM' : ' AM'}`

    return CreationHourOfMessage
}

export const ConvertDateToDayFormat = (creationDateOfMessage: Date) => {
    // const dateOfCreation = new Date(creationDateOfMessage) 
    const actualDate = new Date()

    const creationday = creationDateOfMessage.getDay()
    const today = actualDate.getDay()

    const CreationDayOfMessage = `${creationday === today ? 'today' : creationday === today - 1 ? 'yesterday' : creationDateOfMessage.toLocaleString('default', { weekday: 'long' })}`

    return CreationDayOfMessage
}

export const GetCurrentDateString = () => {
    const date = new Date();

    // Obtenemos los componentes de la fecha
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');  // Meses van de 0 a 11
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    const milliseconds = String(date.getMilliseconds()).padStart(3, '0');

    // Creamos la cadena con el formato deseado
    const dateString = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}.${milliseconds}`;

    return dateString
}


export const TransformDateToCorrectFormatString = (dateToTransform: any) => {
    const date = new Date(dateToTransform);

    // Obtenemos los componentes de la fecha
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');  // Meses van de 0 a 11
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    const milliseconds = String(date.getMilliseconds()).padStart(3, '0');

    // Creamos la cadena con el formato deseado
    const dateString = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}.${milliseconds}`;

    return dateString
}
