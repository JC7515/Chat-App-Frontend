import { useState } from 'react'

const WithSearch = (component: any, dataSet: any) => {
    return function () {
       const [query, setQuery] = useState("")

       const HandleChangeQuery = (e: any) => {
          setQuery(e.target.value)
       }

        return (
            <div>
                <input onChange={HandleChangeQuery} value={query} type="text" />
                {/* <component query={query} dataSet={dataSet} /> */}
            </div>
        )
    }
}

export default WithSearch