import RegisterForm from '@/features/Register/Form/RegisterForm';
import Container from '@/components/Container/Container';
import Order from '@/features/Register/Order/Order';

export default function SignIn() {
  const onStepSubmit = () => {
    
  };

  return (
    <section>
      <Container className="pt-6 pb-32">
        <div className="grid grid-cols-12 gap-24">
          <RegisterForm onStepSubmit={onStepSubmit} />
          <Order
            nextStepDisabled={false}
            onStepSubmit={onStepSubmit}
          />
        </div>
      </Container>
    </section>
  );
}
