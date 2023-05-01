export interface AdressModel {
    message: string;
    address: {
        street: string,
        suite: string,
        city: string,
        zipcode: string,
        geo: {
            lat: string ,
            lng: string
        }
}
}