import { GetUserDataValidated } from "@/utils"
import { NextComponentType } from "next"
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime"


export const GetUserData = async (nextRouter: any) => {

    try {
        return await GetUserDataValidated()
        //   dispatch(updateUserAuth(true))
        //   dispatch(setUserData(useData))

    } catch (err) {
        console.log(err)
        nextRouter.push('/')
    }
}  