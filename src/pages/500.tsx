import Container from '@/components/layout/Container'
import Wrapper from '@/components/layout/Wrapper'

export default function Custom500() {
    return (
        <Wrapper>
            <Container>
                <div className="flex justify-center items-center h-screen">
                    <h1 className="py-1 text-center">
                        {' '}
                        An error has occurred{' '}
                    </h1>
                </div>
            </Container>
        </Wrapper>
    )
}
