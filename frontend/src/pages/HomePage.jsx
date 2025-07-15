import { Container, SimpleGrid, Text, VStack } from "@chakra-ui/react";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useUserStore } from "../users/user"; 
import UserCard from "../components/UserCard"; 

const HomePage = () => {
    const { fetchUsers, users } = useUserStore(); 

    useEffect(() => {
        fetchUsers(); 
    }, [fetchUsers]);
    console.log("users", users); 

    return (
        <Container maxW='container.xl' py={12}>
            <VStack spacing={8}>
                <Text
                    fontSize={"30"}
                    fontWeight={"bold"}
                    bgGradient={"linear(to-r, cyan.400, blue.500)"}
                    bgClip={"text"}
                    textAlign={"center"}
                >
                    Current Users
                </Text>

                <SimpleGrid
                    columns={{
                        base: 1,
                        md: 2,
                        lg: 3,
                    }}
                    spacing={10}
                    w={"full"}
                >
                    {users.map((user) => ( 
                        <UserCard key={user._id} user={user} /> 
                    ))}
                </SimpleGrid>

                {users.length === 0 && ( 
                    <Text fontSize='xl' textAlign={"center"} fontWeight='bold' color='gray.500'>
                        No users found {" "}
                        <Link to={"/create"}>
                            <Text as='span' color='blue.500' _hover={{ textDecoration: "underline" }}>
                                Add a user
                            </Text>
                        </Link>
                    </Text>
                )}
            </VStack>
        </Container>
    );
};
export default HomePage;