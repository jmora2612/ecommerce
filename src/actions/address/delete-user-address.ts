"use server";

import prisma from "@/lib/prisma";


export const deleteUserAddress = async(userId:string)=>{
    try {
        const deletAddress = await deleteAddress(userId)

        return {
            ok: true,
            data:deletAddress
        }
        
    } catch (error) {
        console.log('Error en deleteUserAddress',error);
        
        return{
            ok:false,
            message:'No se pudo eliminar la direccion del usuario'
        }
    }
}

const deleteAddress = async(userId:string)=>{
    try {

        const deleteAdd = await prisma.userAddress.delete({
            where:{
                userId
            }
        })
        return deleteAdd
        
    } catch (error) {
        console.log('Error en deleteAddress', error);
        throw 'No se pudo eliminar la direccion del usuario'
    }
}