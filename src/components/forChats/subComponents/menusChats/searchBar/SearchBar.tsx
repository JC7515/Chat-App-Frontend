import { CONTACT_CHAT, iconsForChatsPage } from '@/components/forChats/ChatsContent.data'
import { contactBody, groupBody, InputEvent } from '@/components/types'
import { updatecontactsList } from '@/redux/features/contactsListSlice'
import { updateGroupChatList } from '@/redux/features/groupChatsListSlice'
import { useAppDispatch, useAppSelector } from '@/redux/hooks'
import { GetAllContacts, GetAllGroupChats } from '@/utils'
import React, { useState } from 'react'

interface Props { chatType: string }


const SearchBar = ({ chatType }: Props ) => {

  // Props =  type : "Groups" | "contacts"  

  const [contactsListQuery, setContactsListQuery] = useState<string>('')
  const [groupsListQuery, setGroupsListQuery] = useState<string>('')

  const contactsList = useAppSelector(state => state.contactsListSlice.data)
  const groupChatsList = useAppSelector(state => state.groupChatsListSlice.data)
  

  const dispatch = useAppDispatch()


  
  const FilterContactList = async (e: InputEvent) => {

    const inputValue = e.target.value

    setContactsListQuery(inputValue)

    if (inputValue === '') {
      const contactsListObtained: contactBody[] = await GetAllContacts()
      dispatch(updatecontactsList(contactsListObtained))
      return
    }


    const contactsFiltered: contactBody[] = contactsList.filter((item: contactBody) => item.contact_user.username.indexOf(inputValue) === 0)

    dispatch(updatecontactsList(contactsFiltered))

  }


  const FilterGroupsList = async (e: InputEvent) => {

    const inputValue: string = e.target.value

    setGroupsListQuery(inputValue)

    if (inputValue === '') {
      const groupsListObtained: groupBody[] = await GetAllGroupChats()
      dispatch(updateGroupChatList(groupsListObtained))
      return
    }

    const groupsFiltered: groupBody[] = groupChatsList.filter((item: groupBody) => item.group.group_name.indexOf(inputValue) === 0)

    dispatch(updateGroupChatList(groupsFiltered))

  }


  return (
    <>
      <div data-testid={`SearchBar${chatType}`} className="w-full flex flex-row gap-1 p-2 bg-zinc-600 rounded-md">
        <div data-testid="SearchBarIcon">{iconsForChatsPage[1].icon}</div>
        <input className="w-full text-xs bg-transparent outline-none" type="text" placeholder="Search" value={ chatType === CONTACT_CHAT ? contactsListQuery: groupsListQuery} onChange={chatType === CONTACT_CHAT ?FilterContactList : FilterGroupsList} />
      </div>
    </>
  )
}

export default SearchBar