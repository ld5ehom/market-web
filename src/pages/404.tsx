import Container from '@/components/layout/Container'
import Wrapper from '@/components/layout/Wrapper'

export default function Custom404() {
    return (
        <Wrapper>
            <Container>
                <div className="flex justify-center items-center h-screen">
                    <h1 className="py-1"> 404 - Page Not Found </h1>
                </div>
            </Container>
        </Wrapper>
    )
}
