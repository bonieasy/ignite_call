import { Heading, Text } from '@ignite-ui/react'
import Image from 'next/image'
import { Container, Hero, Preview } from './styles'
import previewImage from '../../assets/app-preview.png'
import { ClaimUsernameForm } from './components/ClaimUsernameForm'

export default function Home() {
  return (
    <Container>
      <Hero>
        <Heading size="4xl">Agendamento Descomplicado</Heading>
        <Text size="xl">Conecte seu calendário e permita que as pessoas marquem agendamentos no seu tempo livre.</Text>
        
        <ClaimUsernameForm />
      </Hero>

      <Preview>
        <Image src={previewImage} height={400} quality={100} priority alt='Calendario simbolizando aplicacao em funcionamento' />
        
      </Preview>

    </Container>
  )
}
