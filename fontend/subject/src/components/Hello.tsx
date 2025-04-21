type HelloProps = {
    name: string
  }
  
  const Hello = ({ name }: HelloProps) => {
    return <h2>Chào bạn, {name}!</h2>
  }
  
export default Hello
  