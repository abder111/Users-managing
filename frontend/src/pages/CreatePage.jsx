import { Box, Button, Container, Heading, Input, useColorModeValue, useToast, VStack } from "@chakra-ui/react";
import { useState } from "react";
import { useUserStore } from "../users/user"; 

const CreatePage = () => {
    const [newUser, setNewUser] = useState({ 
        name: "",
        age: "",
        email: "",
    });
    const toast = useToast();

    const { createUser } = useUserStore(); 

    const handleAddUser = async () => { 
        const { success, message } = await createUser(newUser); 
        if (!success) {
            toast({
                title: "Error",
                description: message,
                status: "error",
                isClosable: true,
            });
        } else {
            toast({
                title: "Success",
                description: message,
                status: "success",
                isClosable: true,
            });
        }
        setNewUser({ name: "", age: "", email: "" }); 
    };

    return (
        <Container maxW={"container.sm"}>
            <VStack spacing={8}>
                <Heading as={"h1"} size={"2xl"} textAlign={"center"} mb={8}>
                    Add New User
                </Heading>

                <Box w={"full"} bg={useColorModeValue("white", "gray.800")} p={6} rounded={"lg"} shadow={"md"}>
                    <VStack spacing={4}>
                        <Input
                            placeholder='User Name'
                            name='name'
                            value={newUser.name} 
                            onChange={(e) => setNewUser({ ...newUser, name: e.target.value })} 
                        />
                        <Input
                            placeholder='Age'
                            name='age'
                            type='number'
                            value={newUser.age} 
                            onChange={(e) => setNewUser({ ...newUser, age: e.target.value })} 
                        />
                        <Input
                            placeholder='Email'
                            name='email'
                            value={newUser.email} 
                            onChange={(e) => setNewUser({ ...newUser, email: e.target.value })} 
                        />

                        <Button colorScheme='blue' onClick={handleAddUser} w='full'> {}
                            Add User
                        </Button>
                    </VStack>
                </Box>
            </VStack>
        </Container>
    );
};
export default CreatePage;