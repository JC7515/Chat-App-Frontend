import { filterItems } from '@/utils'
import React from 'react'
import Group from './Group'

const GroupList = ({ query, dataSet }: any) => {

    const items = filterItems(query, dataSet)

    return (
        <div>
            {/* { items.map((group: any) => {
           <Group key={group.group.group_id} title={group.group.group_name} icon={group.group.group_icon} notificationsNumber={group.notifications_number} />
        })
        } */}
        </div>
    )
}

export default GroupList