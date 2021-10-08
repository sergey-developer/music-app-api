const checkString = (value: string) => {
  return (anotherValue: string): boolean => value === anotherValue
}

export default checkString
