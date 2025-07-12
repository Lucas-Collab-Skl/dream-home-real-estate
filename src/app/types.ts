export type Property = {
    propertyNo: string;
    street: string;
    city: string;
    postalCode: string;
    type: string;
    rooms: number;
    rent: number;
    ownerNo: string;
    staffNo: string;
    branchNo: string;
    picture: string;
    floorplan: string;
}

export type Staff = {
    staffNo: string;
    firstName: string;
    lastName: string;
    position: string;
    sex: string;
    DOB: Date;
    salary: number;
    branchNo: string;
    telephone: string;
    mobile: string;
    email: string;
}