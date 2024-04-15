import { beforeAll, describe, expect, test, vi, afterEach, afterAll } from 'vitest'
import { render, screen } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import AuthCard from '@/components/forLogin/authCard/AuthCard'
import ProfilePage from '@/app/profile/page'
import { Provider } from 'react-redux';
import configureStore, { MockStoreEnhanced } from 'redux-mock-store';
// import { store } from '@/redux/store'
import { Providers } from '@/redux/provider'
import { ACCESS_TOKEN_NAME, COOKIE_OPTIONS } from '@/components/forLogin/authCard/AuthCard.data'
import { CookieSerializer } from '@/helpers'
import { bodyUserData, contactBody, groupBody } from '@/components/types'
import { GetUserDataValidated, GetAllContacts, GetAllNotificationsOfChat, GetAllNotificationsOfUser, GetAllGroupChats, GetAllMessagesFromAContactChat, GetAllMessagesFromAGroupChat } from '@/utils'
import ChatsContent from '@/components/forChats/ChatsContent'
import { type } from '@testing-library/user-event/dist/types/setup/directApi'
import { server } from '../mocks/node'
import { chatMessagesList, chatParticipantList, contactChatList, groupChatList, memberList, mockChatParticipantData, mockGroupMember, mockUserContact, mockUserContactData, mockUserData, NewTestContact, NewTestGroup, testMessage, TestMessage, userFoundsList } from '@/mocks/handlers'



beforeAll(() => {
    vi.mock("next/router", () => require("next-router-mock"));
    vi.mock("next/navigation", () => require("next-router-mock"));

})



const listOfcookies = [
    { name: ACCESS_TOKEN_NAME, value: 'TestToken' }
]

// Bucle que serializa y registra las cookies en el objeto cookie del navegador
CookieSerializer(listOfcookies, COOKIE_OPTIONS)


describe('Login Page', () => {


    test('Should Validate Information and Functioning About The Login Page', () => {


        const user = userEvent.setup()

        const testUserData = {
            email: 'userTest.123@gmail.com',
            password: 'UserTest123'
        }

        render(<AuthCard />)


        // aqui validamos que exista el texto Adready a member? en la pagina
        const AdreadyAmemberText = screen.getByText('Adready a member?')
        expect(AdreadyAmemberText).toBeDefined()

        // aqui validamos que exista el texto singUp en la pagina
        const signUpLink = screen.getByText('singUp')
        expect(signUpLink).toBeDefined()


        // aqui validamos que exista el formulario
        const form = screen.getByRole('form')
        expect(form).toBeDefined()

        // aqui validamos que exista el input email del formulario 
        const inputEmail = screen.getByTestId('email')
        expect(inputEmail).toBeDefined()

        // aqui validamos que exista el input password del formulario
        const inputPassword = screen.getByTestId('password')
        expect(inputPassword).toBeDefined()

        // aqui validamos que exista el bottom del formulario
        const formLoginButton = form.querySelector('button')
        expect(formLoginButton).toBeDefined()



        user.type(inputEmail, testUserData.email)
        user.type(inputPassword, testUserData.password)
        user.click(formLoginButton!)


    })

})



describe('Profile Page', () => {


    test('Should Validate Information and Functioning About The Profile Page', async () => {



        const user = userEvent.setup()


        render(
            <Providers>
                <ProfilePage />
            </Providers>
        )


        // aqui validamos que exista el titulo Personal info en la pagina
        const PersonalInfoTitle = screen.getByText('Personal info')
        expect(PersonalInfoTitle).toBeDefined()

        // aqui validamos que exista el subtitulo de titulo Personal info en la pagina
        const subtitleOfPersonalInfoTitle = screen.getByText('Basic info, like your name and photo')
        expect(subtitleOfPersonalInfoTitle).toBeDefined()


        // aqui validamos que exista el button de editar informacion Personal en la pagina
        const EditButton = screen.getByText('Edit')
        expect(EditButton).toBeDefined()


        // aqui validamos que exista el titulo Photo en la pagina
        const PhotoTitle = screen.getByText('PHOTO')
        expect(PhotoTitle).toBeDefined()


        await vi.waitFor(async () => {

            // aqui validamos que exista el titulo Name y el nombre del usuario de prueba en la pagina
            const NameTitle = screen.getByText('NAME')
            expect(NameTitle).toBeDefined()
            const TestUserName = screen.getByText(mockUserData.name)
            expect(TestUserName).toBeDefined()


            // aqui validamos que exista el titulo UserName y el userNombre del usuario de prueba en la pagina
            const UserNameTitle = screen.getByText('USERNAME')
            expect(UserNameTitle).toBeDefined()
            const UserNameofuserTest = screen.getAllByText(mockUserData.username)
            expect(UserNameofuserTest).toBeDefined()


            // aqui validamos que exista el titulo Bio y la biografia del usuario de prueba en la pagina
            const BioTitle = screen.getByText('BIO')
            expect(BioTitle).toBeDefined()
            const testUserBio = screen.getByText(mockUserData.biography)
            expect(testUserBio).toBeDefined()

            // aqui validamos que exista el titulo Phone y el telefono del usuario de prueba en la pagina
            const PhoneTitle = screen.getByText('PHONE')
            expect(PhoneTitle).toBeDefined()
            const testUserPhone = screen.getByText(mockUserData.phone)
            expect(testUserPhone).toBeDefined()


            // aqui validamos que exista el titulo Email y el email del usuario de prueba en la pagina
            const EmailTitle = screen.getByText('EMAIL')
            expect(EmailTitle).toBeDefined()
            const testUserEmail = screen.getByText(mockUserData.email)
            expect(testUserEmail).toBeDefined()

            // aqui validamos que exista el titulo Password del usuario de prueba en la pagina
            const PasswordTitle = screen.getByText('PASSWORD')
            expect(PasswordTitle).toBeDefined()


        }, {
            timeout: 2000,
        })



        // aqui validamos que exista el titulo del navBar en la pagina
        const NavBarTitle = screen.getByText('DevPros')
        expect(NavBarTitle).toBeDefined()


        // aqui validamos que exista el button del navBar para abrir la lista de opciones en la pagina
        const buttonToOpenOptionsList = screen.getByTestId('buttonToOpenOptionsList')
        expect(buttonToOpenOptionsList).toBeDefined()


        // aqui ejecutamos un evento click para abrir la lista de opciones del navbar 
        user.click(buttonToOpenOptionsList!)


        await vi.waitFor(async () => {


            // aqui validamos que exista la lista de opciones en el navbar una vez que apretamos el button para abrila en la pagina
            const NavBarOptionsList = screen.getByTestId('navBarListOptions')
            expect(NavBarOptionsList).toBeDefined()

            // aqui validamos que exista el texto My profile  en la lista de opciones del navBar en la pagina
            const MyProfileOption = screen.getByText('My profile')
            expect(MyProfileOption).toBeDefined()

            // aqui validamos que exista el texto Group Chat  en la lista de opciones del navBar en la pagina
            const GroupChatOption = screen.getByText('Group Chat')
            expect(GroupChatOption).toBeDefined()

            // aqui validamos que exista el texto Logout en la lista de opciones del navBar en la pagina
            const LogOutOption = screen.getByText('Logout')
            expect(LogOutOption).toBeDefined()


        }, {
            timeout: 2000,
        })


    })

})



describe('Chats Page', async () => {




    test('Should Validate Information and Functioning About The Chats Page', async () => {


        const user = userEvent.setup()

        render(
            <Providers>
                <ChatsContent />
            </Providers>
        )



        // // ******AQUI VALIDAMOS QUE APARESCA EL LOADER CUANDO EL USUARIO ESTA INGRESANDO A LA CHATS PAGE******

        const LoaderBoby = screen.getByTestId('LoaderBody')
        expect(LoaderBoby).toBeDefined()

        const LoaderIcon = screen.getByTestId('LoaderIcon')
        expect(LoaderIcon).toBeDefined()


        const ChatifyLoaderMessage = screen.getByText('Chatify')
        expect(ChatifyLoaderMessage).toBeDefined()


        // screen.debug()

        // aqui estamos esperando hasta que el loader desaparesca para validar que no exite, y permitir que los demas queries se validen 
        await vi.waitFor(async () => {
            const ChatifyLoaderMessage = screen.queryByText('Chatify')
            expect(ChatifyLoaderMessage).toBe(null)

        }, {
            timeout: 2000,
        })


        // ******AQUI VALIDAMOS QUE EXISTAN TODOS LOS ELEMENTOS DE UI CUANDO ES SU PRIMERA VEZ DEL USUARIO INGRESANDO A LA CHATS PAGE******


        // **** AQUI VALIDAMOS LA ZONA DE LOS MENSAJES ****

        // aqui validamos que exista la imagen de inicio de pagina en la pagina
        const PageStartImage = screen.getByTestId('PageStartImage')
        expect(PageStartImage).toBeDefined()


        // aqui validamos que exista el titulo de llamada a la accion ah descargar la app en moviles en la pagina
        const DownloadChatifyTitle = screen.getByText('Download Chatify soon in ios and android application')
        expect(DownloadChatifyTitle).toBeDefined()

        // aqui validamos que exista el sub titulo de llamada a la accion ah descargar la app en moviles en la pagina
        const DownloadChatifyInfoTitle = screen.getByText('Chatify soon in ios and android application')
        expect(DownloadChatifyInfoTitle).toBeDefined()

        // aqui validamos que exista el button Get more information en la pagina
        const GetMoreInformationButton = screen.getByTestId('GetMoreInformationButton')
        expect(GetMoreInformationButton).toBeDefined()



        // **** AQUI VALIDAMOS LA ZONA DE LA LISTA DE CHATS DE GRUPO ****



        // aqui validamos que exista el titulo de Channels arriba de la lista de chats de grupos en la pagina
        const ChannelsTitle = screen.getByText(`Channels`)
        expect(ChannelsTitle).toBeDefined()


        // aqui validamos que exista el SearchBar en la pagina
        const SearchBarGroup = screen.getByTestId('SearchBargroup')
        expect(SearchBarGroup).toBeDefined()


        // aqui validamos que exista el input del SearchBar en la pagina
        const SearchBarGroupInput = SearchBarGroup.querySelectorAll('input')
        expect(SearchBarGroupInput).toBeDefined()


        // aqui validamos que exista el div que envuelve el  icono que acompaña al mensaje ThereArentGroups en la pagina
        const ThereArentGroupsIconDiv = screen.getByTestId('ThereArentGroupsIconDiv')
        expect(ThereArentGroupsIconDiv).toBeDefined()

        // aqui validamos que exista el icono svg que lo envuelve el div que acompaña al mensaje ThereArentGroups en la pagina
        const ThereArentGroupsIconSvg = ThereArentGroupsIconDiv.querySelector('svg')
        expect(ThereArentGroupsIconSvg).not.toBe(null)


        // aqui validamos que exista el mensaje ThereArentGroupsMessage en caso el usuario no tenga grupos en la pagina
        const ThereArentGroupsMessage = screen.getByText(`There aren't Groups`)
        expect(ThereArentGroupsMessage).toBeDefined()



        // **** AQUI VALIDAMOS LA ZONA DE LA LISTA DE CHATS DE CONTACTOS ****


        // aqui validamos que exista el titulo de Contacts arriba de la lista de chats de contactos en la pagina
        const ContactsTitle = screen.getByText(`Contacts`)
        expect(ContactsTitle).toBeDefined()


        // aqui validamos que exista el SearchBar en la pagina
        const SearchBarContact = screen.getByTestId('SearchBarcontact')
        expect(SearchBarContact).toBeDefined()


        // aqui validamos que exista los dos iconos de la lupa de los dos SearchBar para la lista de grupo y contactos en la pagina
        const SearchBarContactIcon = await screen.findAllByTestId('SearchBarIcon')
        expect(SearchBarContactIcon).toBeDefined()


        // aqui validamos que exista el input del SearchBar en la pagina
        const SearchBarContactInput = SearchBarContact.querySelectorAll('input')
        expect(SearchBarContactInput).toBeDefined()


        // aqui validamos que exista el div padre que envuelve icono svg que acompaña al mensaje ThereArentContacts en la pagina
        const ThereArentContactsIconDiv = screen.getByTestId('ThereArentContactsIconDiv')
        expect(ThereArentContactsIconDiv).toBeDefined()


        // aqui validamos que exista el icono svg que lo envuelve el div que acompaña al mensaje ThereArentContacts en la pagina
        const ThereArentContactsIconSvg = ThereArentContactsIconDiv.querySelector('svg')
        expect(ThereArentContactsIconSvg).not.toBe(null)


        // aqui validamos que exista el mensaje ThereArentContactsMessage en caso el usuario no tenga grupos en la pagina
        const ThereArentContactsMessage = screen.getByText(`There aren't Contacts`)
        expect(ThereArentContactsMessage).toBeDefined()


        // **** AQUI VALIDAMOS LA ZONA LA INFO DEL USUARIO COMO SU FOTO DE PERIL Y NOMBRE Y LAS OPCIONES QUE LISTA DE OPCIONES QUE TIENE ****      

        // aqui validamos que exista la foto de perfil del usuario en la pagina
        const UserProfilepictureInChatPage = screen.getByTestId('profilePicture')
        expect(UserProfilepictureInChatPage).toBeDefined()

        // aqui validamos que exista el user name del usuario en la pagina
        const UserNameInChatPage = await screen.findAllByText('userTest')
        expect(UserNameInChatPage).toBeDefined()


        // aqui validamos que exista la foto de perfil del usuario en la pagina
        const optionsListButtonInChatPage = await screen.findByTestId('optionsListButton')
        expect(optionsListButtonInChatPage).toBeDefined()

        await user.click(optionsListButtonInChatPage!)




        // aqui validamos que exista la lista de opciones en el navbar una vez que apretamos el button para abrila en la pagina
        const NavBarOptionsListInChatPage = await screen.findByTestId('navBarListOptions')
        expect(NavBarOptionsListInChatPage).toBeDefined()




        // aqui validamos que exista el texto My profile  en la lista de opciones del navBar en la pagina
        const MyProfileOptionInChatPage = await screen.findAllByText('My profile')
        expect(MyProfileOptionInChatPage).toBeDefined()

        // aqui validamos que exista el texto Group Chat  en la lista de opciones del navBar en la pagina
        const GroupChatOptionInChatPage = await screen.findAllByText('Group Chat')
        expect(GroupChatOptionInChatPage).toBeDefined()

        // aqui validamos que exista el texto Logout en la lista de opciones del navBar en la pagina
        const LogOutOptionInChatPage = await screen.findAllByText('Logout')
        expect(LogOutOptionInChatPage).toBeDefined()




    })


    test('Should Validate Information and Functioning About The list of actions for create new groups and more', async () => {


        const user = userEvent.setup()

        render(
            <Providers>
                <ChatsContent />
            </Providers>
        )

        const ChatifyLoaderMessage = screen.getByText('Chatify')
        expect(ChatifyLoaderMessage).toBeDefined()

        await vi.waitFor(async () => {
            const ChatifyLoaderMessage = screen.queryByText('Chatify')
            expect(ChatifyLoaderMessage).toBe(null)

        }, {
            timeout: 2000,
        })


        // // ******AQUI CREAMOS UN NUEVO GRUPO Y VALIDAMOS QUE EL GRUPO APARESCA EN LA LISTA DE CHATS DE GRUPOS ******

        // aqui validamos que exista el button de mas que abre la ventana de opciones para crear grupos y mas en la pagina
        const MoreActionListButton = await screen.findByTestId('MoreActionListButton')
        expect(MoreActionListButton).toBeDefined()


        await user.click(MoreActionListButton!)


        // aqui validamos que exista el boton para crear un nuevo grupo o canal en la lista de grupos en la pagina
        const CreateNewChannelButton = screen.getByRole('button', { name: 'Create New Channel' })

        expect(CreateNewChannelButton).toBeDefined()


        // aqui validamos que exista el boton para entrar  nuevo grupo o canal en la lista de grupos en la pagina
        const EnterToAChannelButton = screen.getByRole('button', { name: 'Enter to a Channel' })

        expect(EnterToAChannelButton).toBeDefined()


        // aqui validamos que exista el boton para agregar un nuevo contacto en la lista de contactos en la pagina
        const AddNewContactButton = screen.getByRole('button', { name: 'Add New Contact' })

        expect(AddNewContactButton).toBeDefined()


        await user.click(CreateNewChannelButton!)


        screen.debug()

        // aqui validamos que exista el formulario de creacion de nuevo grupo o canal en la pagina
        const FormToCreateChannel = await screen.findByTestId('FormToCreateChannel')
        expect(FormToCreateChannel).toBeDefined()


        // aqui validamos que exista el input donde pondremos el nombre del nuevo canal a crear en el formulario en la pagina
        const FormChannelName = screen.getByTestId('channelName')
        expect(FormChannelName).toBeDefined()

        // aqui validamos que exista el input donde pondremos la contraseña del nuevo canal a crear en el formulario en la pagina
        const FormChannelPassword = screen.getByTestId('channelPassword')
        expect(FormChannelPassword).toBeDefined()

        // aqui validamos que exista el textarea donde pondremos la descripcion del nuevo canal a crear en el formulario en la pagina
        const FormChannelDescription = screen.getByTestId('channelDescription')
        expect(FormChannelDescription).toBeDefined()


        // aqui validamos que exista el boton para crear el nuevo grupo o canal en la pagina
        const FormChannelSaveButton = screen.getByTestId('channelSaveButton')
        expect(FormChannelSaveButton).toBeDefined()


        const TestGroupData = {
            name: 'TestGroup',
            password: '123456789',
            description: 'Test Group Description'
        }



        await user.type(FormChannelName, TestGroupData.name)
        await user.type(FormChannelPassword, TestGroupData.password)
        await user.type(FormChannelDescription, TestGroupData.description)

        groupChatList.push(NewTestGroup)
        memberList.push(mockGroupMember)
        chatParticipantList.push(mockChatParticipantData)

        // console.log(groupChatList, 'push Group')
        // console.log(memberList, 'push Member')
        // console.log(chatParticipantList, 'push participant')


        await user.click(FormChannelSaveButton)

        screen.debug()


        await vi.waitFor(async () => {

            // aqui validamos que exista el mensaje ThereArentGroupsMessage en caso el usuario no tenga grupos en la pagina
            const ThereArentGroupsMessage = screen.queryByText(`There aren't Groups`)
            expect(ThereArentGroupsMessage).toBe(null)

        }, {
            timeout: 2000,
        })


        // aqui validamos que exista el nuevo grupo que creamos en la lista de grupos en la pagina
        const ValidateNameNewGroupCreated = await screen.findByText('TestGroup')
        expect(ValidateNameNewGroupCreated).toBeDefined()


        // aqui validamos que exista el nuevo icono de grupo que creamos en la lista de grupos en la pagina
        const ValidateIconNewGroupCreated = screen.getByText('TG')
        expect(ValidateIconNewGroupCreated).toBeDefined()


        await user.click(ValidateNameNewGroupCreated!)


        // aqui validamos que exista el formulario donde pondremos los mensajes antes de ser enviado en el chat seleccionado en la pagina
        const MessageBarForm = screen.getByTestId('MessageBarForm')
        expect(MessageBarForm).toBeDefined()


        // aqui validamos que exista el barra de mensajes que es un input donde pondremos los mensajes antes de ser enviado en el chat seleccionado en la pagina
        const MessageBar = screen.getByTestId('MessageBar')
        expect(MessageBar).toBeDefined()

        // aqui validamos que exista el barra de mensajes que es un input donde pondremos los mensajes antes de ser enviado en el chat seleccionado en la pagina
        const SendMessagesButton = screen.getByTestId('SendMessagesButton')
        expect(SendMessagesButton).toBeDefined()


        await user.type(MessageBar, TestMessage)
        await user.click(SendMessagesButton!)

        chatMessagesList.push(testMessage)

        // aqui validamos que exista el boton para entrar  nuevo grupo o canal en la lista de grupos en la pagina
        // const ValidateTestMessage = screen.findByText('caca')
        const ValidateTestMessage = screen.findByText(TestMessage)
        expect(ValidateTestMessage).toBeDefined()


        // aqui validamos que exista el boton con el icono de tacho de basura para que el usuario pueda salir del grupo en la pagina
        const LeaveGroupButtonOnGroupMenu = await screen.findByTestId('LeaveGroupButtonOnGroupMenu')
        expect(LeaveGroupButtonOnGroupMenu).toBeDefined()


        await user.click(LeaveGroupButtonOnGroupMenu!)


        await vi.waitFor(async () => {

            // aqui validamos que exista la venta donde esta el boton para que el usuario salga del grupo en la pagina
            const LeaveGroupCard = await screen.findByTestId('LeaveGroupCard')
            expect(LeaveGroupCard).toBeDefined()

            // aqui validamos que exista la venta donde esta el boton para que el usuario salga del grupo en la pagina
            const LeaveGroupButton = await screen.findByTestId('LeaveGroupButton')
            expect(LeaveGroupButton).toBeDefined()

            await user.click(LeaveGroupButton!)

            groupChatList.splice(groupChatList.length - 1, 1)
            chatMessagesList.splice(0)

            // console.log(groupChatList, ' Delete groupChatList item')
            // console.log(chatMessagesList, ' Delete groupChatList item')


        }, {
            timeout: 2000,
        })


        // AQUI VALIDAMOS QUE SE HAYA ELIMINADO EL GRUPO EXITOSAMENTE Y APARESCA EL MENSAJE DE There aren't Groups EN LA LISTA DE GRUPOS
        await vi.waitFor(async () => {


            // aqui validamos que exista el div que envuelve el  icono que acompaña al mensaje ThereArentGroups en la pagina
            const ThereArentGroupsIconDiv = screen.getByTestId('ThereArentGroupsIconDiv')
            expect(ThereArentGroupsIconDiv).toBeDefined()

            // aqui validamos que exista el icono svg que lo envuelve el div que acompaña al mensaje ThereArentGroups en la pagina
            const ThereArentGroupsIconSvg = ThereArentGroupsIconDiv.querySelector('svg')
            expect(ThereArentGroupsIconSvg).not.toBe(null)


            // aqui validamos que exista el mensaje ThereArentGroupsMessage en caso el usuario no tenga grupos en la pagina
            const ThereArentGroupsMessage = screen.getByText(`There aren't Groups`)
            expect(ThereArentGroupsMessage).toBeDefined()


            // aqui validamos que exista el div padre que envuelve icono svg que acompaña al mensaje ThereArentContacts en la pagina
            const ThereArentContactsIconDiv = screen.getByTestId('ThereArentContactsIconDiv')
            expect(ThereArentContactsIconDiv).toBeDefined()


            // aqui validamos que exista el icono svg que lo envuelve el div que acompaña al mensaje ThereArentContacts en la pagina
            const ThereArentContactsIconSvg = ThereArentContactsIconDiv.querySelector('svg')
            expect(ThereArentContactsIconSvg).not.toBe(null)


            // aqui validamos que exista el mensaje ThereArentContactsMessage en caso el usuario no tenga grupos en la pagina
            const ThereArentContactsMessage = screen.getByText(`There aren't Contacts`)
            expect(ThereArentContactsMessage).toBeDefined()


        }, {
            timeout: 3000,
        })



    })


    // *******************CONTACT***********************

    test('Should Validate Information and Functioning About The list of actions for add new     contact chat and more', async () => {


        const user = userEvent.setup()

        render(
            <Providers>
                <ChatsContent />
            </Providers>
        )

        const ChatifyLoaderMessage = screen.getByText('Chatify')
        expect(ChatifyLoaderMessage).toBeDefined()

        await vi.waitFor(async () => {
            const ChatifyLoaderMessage = screen.queryByText('Chatify')
            expect(ChatifyLoaderMessage).toBe(null)

        }, {
            timeout: 2000,
        })


        // // ******AQUI CREAMOS UN NUEVO GRUPO Y VALIDAMOS QUE EL GRUPO APARESCA EN LA LISTA DE CHATS DE GRUPOS ******

        // aqui validamos que exista el button de mas que abre la ventana de opciones para crear grupos y mas en la pagina
        const MoreActionListButton = await screen.findByTestId('MoreActionListButton')
        expect(MoreActionListButton).toBeDefined()


        await user.click(MoreActionListButton!)


        // aqui validamos que exista el boton para crear un nuevo grupo o canal en la lista de grupos en la pagina
        const CreateNewChannelButton = screen.getByRole('button', { name: 'Create New Channel' })

        expect(CreateNewChannelButton).toBeDefined()


        // aqui validamos que exista el boton para entrar  nuevo grupo o canal en la lista de grupos en la pagina
        const EnterToAChannelButton = screen.getByRole('button', { name: 'Enter to a Channel' })

        expect(EnterToAChannelButton).toBeDefined()


        // aqui validamos que exista el boton para agregar un nuevo contacto en la lista de contactos en la pagina
        const AddNewContactButton = screen.getByRole('button', { name: 'Add New Contact' })

        expect(AddNewContactButton).toBeDefined()


        await user.click(AddNewContactButton!)


        // aqui validamos que exista la card de agregar un nuevo contacto en la pagina
        const AddNewContactCard = await screen.findByTestId('AddNewContactCard')
        expect(AddNewContactCard).toBeDefined()


        // aqui validamos que exista el input donde pondremos el nombre del nuevo contacto que agregar el usuario a su lista de contacto en la pagina
        const AddNewContactInput = await screen.findByTestId('AddNewContactInput')
        expect(AddNewContactInput).toBeDefined()




        const NonExistentContact = 'non-existent-contact'

        // aqui estamos ingresan el nombre de un usuario inexistente en el input de busqueda de contactos para que nos aparesca y validar el texto de matches not found del card de la pagina 
        await user.type(AddNewContactInput, NonExistentContact)


        screen.debug(AddNewContactCard)

        await vi.waitFor(async () => {

            // aqui validamos que exista el contanedor del mensajes de matches not found en la card de la pagina
            const MatchesNotFoundCard = await screen.findByTestId('MatchesNotFoundCard')
            // console.log(MatchesNotFoundCard)
            expect(MatchesNotFoundCard).toBeDefined()


            // aqui validamos que exista el mensaje de matches not found en la card de la pagina
            const MatchesNotFoundMessage = await screen.findByText('matches not found')
            expect(MatchesNotFoundMessage).toBeDefined()


        }, {
            timeout: 2000
        })

        // aqui estamos borrando el anterior texto de NonExistentContact en el input de busqueda de contacto en la pagina  
        await user.clear(AddNewContactInput)


        // aqui estamos agregando la lista de contactos que el usuarios encontrado de la busqueda correcta que realizo el usuario 
        userFoundsList.push(mockUserContact)

        // aqui estamos ingresando dentro del input el usuari ocorrecto a buscar como contacto para el usuario para la pagina 
        await user.type(AddNewContactInput, mockUserContact.username)


        await vi.waitFor(async () => {

            // aqui validamos que exista el input donde pondremos la contraseña del nuevo canal a crear en el formulario en la pagina
            const UserFoundsList = await screen.findByTestId('UserFoundsList')
            expect(UserFoundsList).toBeDefined()


            // Aque estamos validando que exista un elemento en la lista de contacto encontrados por el  usuario en el card de la pagina
            const UserNumberFound = UserFoundsList.childElementCount
            expect(UserNumberFound).toBe(1)

            // aqui validamos que exista el textarea donde pondremos la descripcion del nuevo canal a crear en el formulario en la pagina
            const UserUsernameFound = screen.getByText(mockUserContact.username)
            expect(UserUsernameFound).toBeDefined()


            await user.click(UserUsernameFound!)
        }, {
            timeout: 2000
        })


        await vi.waitFor(async () => {

            // aqui validamos que exista el subtitulo User Selected en la card de la pagina
            const UserSelectedSubTitle = await screen.findByText(mockUserContact.username)
            expect(UserSelectedSubTitle).toBeDefined()


            // aqui validamos que exista el item donde estan los datos del contacto encontado y seleccionado por el usuario en la card de la pagina
            const UserSelectedDiv = await screen.findByTestId('UserSelectedDiv')
            expect(UserSelectedDiv).toBeDefined()


            // aqui validamos que exista el nombre de usuario del contacto que el usuario seleciono para ser agregado a su lista de contactos de la card en la pagina
            const SelectedContactUsername = screen.getByText(mockUserContact.username)
            expect(SelectedContactUsername).toBeDefined()


            await user.click(SelectedContactUsername!)
        }, {
            timeout: 2000
        })

        // aqui validamos que exista el boton para agregar al nuevo contacto selecionado por el usuario de la card en la pagina
        const AddContactButton = await screen.findByTestId('AddContactButton')
        expect(AddContactButton).toBeDefined()


        contactChatList.push(NewTestContact)

        await user.click(AddContactButton)

        // ******************************************************************************************************************************************************************


        // await user.click(FormChannelSaveButton)




        await vi.waitFor(async () => {

            // aqui validamos que exista el nombre del chat del nuevo contacto que recien agrego el usuario  en la pagina
            const NewTestContactChat = await screen.findByText(NewTestContact.contact_user.username)
            expect(NewTestContactChat).toBeDefined()


            await user.click(NewTestContactChat)

        }, {
            timeout: 2000,
        })


        // aqui validamos que exista el formulario donde pondremos los mensajes antes de ser enviado en el chat seleccionado en la pagina
        const MessageBarForm = screen.getByTestId('MessageBarForm')
        expect(MessageBarForm).toBeDefined()


        // aqui validamos que exista el barra de mensajes que es un input donde pondremos los mensajes antes de ser enviado en el chat seleccionado en la pagina
        const MessageBar = screen.getByTestId('MessageBar')
        expect(MessageBar).toBeDefined()

        // aqui validamos que exista el barra de mensajes que es un input donde pondremos los mensajes antes de ser enviado en el chat seleccionado en la pagina
        const SendMessagesButton = screen.getByTestId('SendMessagesButton')
        expect(SendMessagesButton).toBeDefined()


        await user.type(MessageBar, TestMessage)
        await user.click(SendMessagesButton!)

        chatMessagesList.push(testMessage)

        // aqui validamos que exista el boton para entrar  nuevo grupo o canal en la lista de grupos en la pagina
        // const ValidateTestMessage = screen.findByText('caca')
        const ValidateTestMessage = screen.findByText(TestMessage)
        expect(ValidateTestMessage).toBeDefined()


        // aqui validamos que exista el boton con el icono de tacho de basura para que el usuario pueda salir del grupo en la pagina
        const OpenSettingsButton = await screen.findByTestId('OpenSettingsButton')
        expect(OpenSettingsButton).toBeDefined()


        await user.click(OpenSettingsButton!)


        await vi.waitFor(async () => {

            // aqui validamos que exista la venta donde esta el boton para que el usuario salga del grupo en la pagina
            const ContactChatSettingsCard = await screen.findByTestId('ContactChatSettingsCard')
            expect(ContactChatSettingsCard).toBeDefined()

        }, {
            timeout: 2000,
        })


        // aqui validamos que exista la venta donde esta el boton para que el usuario salga del grupo en la pagina
        const DeleteChatHistoryButton = await screen.findByText('Delete Chat History')
        expect(DeleteChatHistoryButton).toBeDefined()

        // aqui validamos que exista la venta donde esta el boton para que el usuario salga del grupo en la pagina
        const BlockThisContactButton = await screen.findByText('Block this Contact')
        expect(BlockThisContactButton).toBeDefined()


        // aqui validamos que exista la venta donde esta el boton para que el usuario salga del grupo en la pagina
        const DeleteThisContactButton = await screen.findByText('Delete This Contact')
        expect(DeleteThisContactButton).toBeDefined()

        await user.click(DeleteThisContactButton!)


        contactChatList.splice(0)

        // console.log(contactChatList, ' Delete contactChatList item')



        // AQUI VALIDAMOS QUE SE HAYA ELIMINADO EL GRUPO EXITOSAMENTE Y APARESCA EL MENSAJE DE There aren't Groups EN LA LISTA DE GRUPOS
        await vi.waitFor(async () => {


            // aqui validamos que exista el div que envuelve el  icono que acompaña al mensaje ThereArentGroups en la pagina
            const ThereArentGroupsIconDiv = screen.getByTestId('ThereArentGroupsIconDiv')
            expect(ThereArentGroupsIconDiv).toBeDefined()

            // aqui validamos que exista el icono svg que lo envuelve el div que acompaña al mensaje ThereArentGroups en la pagina
            const ThereArentGroupsIconSvg = ThereArentGroupsIconDiv.querySelector('svg')
            expect(ThereArentGroupsIconSvg).not.toBe(null)


            // aqui validamos que exista el mensaje ThereArentGroupsMessage en caso el usuario no tenga grupos en la pagina
            const ThereArentGroupsMessage = screen.getByText(`There aren't Groups`)
            expect(ThereArentGroupsMessage).toBeDefined()


            // aqui validamos que exista el div padre que envuelve icono svg que acompaña al mensaje ThereArentContacts en la pagina
            const ThereArentContactsIconDiv = screen.getByTestId('ThereArentContactsIconDiv')
            expect(ThereArentContactsIconDiv).toBeDefined()


            // aqui validamos que exista el icono svg que lo envuelve el div que acompaña al mensaje ThereArentContacts en la pagina
            const ThereArentContactsIconSvg = ThereArentContactsIconDiv.querySelector('svg')
            expect(ThereArentContactsIconSvg).not.toBe(null)


            // aqui validamos que exista el mensaje ThereArentContactsMessage en caso el usuario no tenga grupos en la pagina
            const ThereArentContactsMessage = screen.getByText(`There aren't Contacts`)
            expect(ThereArentContactsMessage).toBeDefined()


        }, {
            timeout: 3000,
        })



    })


})