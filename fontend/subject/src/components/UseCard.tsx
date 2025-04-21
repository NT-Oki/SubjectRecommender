type UseCardProps={
    name:string
    age:number
}
const UseCard=({name,age}:UseCardProps)=>{
    return (
        <div>
            <h3>{name}</h3>
            <h6>{age}</h6>
        </div>
    )
}
export default UseCard