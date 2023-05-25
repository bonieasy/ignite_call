import { Avatar, Heading, Text } from '@ignite-ui/react'
import { GetStaticPaths, GetStaticProps } from 'next'
import { prisma } from '../../../lib/prisma'
import { ScheduleForm } from './ScheduleForm'
import { Container, UserHeader } from './styles'

interface ScheduleProps {
  user: {
    name: string
    bio: string
    avatarUrl: string
  }
}

export default function Schedule({ user }: ScheduleProps) {
  return (
    <Container>
      <UserHeader>
        <Avatar src={user.avatarUrl} />
        <Heading>{user.name}</Heading>
        <Text>{user.bio}</Text>
      </UserHeader>
      <ScheduleForm />
    </Container>
  )
}
//Ex. path: http://localhost:3000/schedule/bonieasy
//URL é dinamica (depende do username), entao é necessario usar o getStaticPaths
//Entao geramos uma pagina estatica por usuario precisamos desse metodo
export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [], //para nao gerar pagina estatica no momento da build, somente quando usuario acessar
    fallback: 'blocking',
  }
}
//getStaticProps -> sempre executado do lado do servidor
//entao conseguimos pegar as informações do usuário
export const getStaticProps: GetStaticProps = async ({ params }) => {
  const username = String(params?.username)

  const user = await prisma.user.findUnique({
    where: {
      username,
    },
  })

  if (!user) {
    return {
      notFound: true, //error404
    }
  }

  return {
    props: {
      user: {
        name: user.name,
        bio: user.bio,
        avatarUrl: user.avatar_url,
      },
    },
    revalidate: 60 * 60 * 24, // 1 day
    //Nnumero em segundos que indica de em quanto em quanto tempo a pagina sera gerada
  }
}