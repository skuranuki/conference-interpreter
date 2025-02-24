import {
    Card,
    CardHeader,
    CardBody,
    Heading,
    Text,
    Box,
    Flex,
    Spinner,
  } from "@chakra-ui/react";
  
  interface TranscriptionCardProps {
    text: string;      // 文字起こしされたテキスト
    isLoading: boolean; // ローディング状態
  }
  
  export function TranscriptionCard({ text, isLoading }: TranscriptionCardProps) {
    return (
      <Card w="full"
            transition="transform 0.2s"
            _hover={{ transform: 'scale(1.2)' }}
            cursor="pointer"
        >
        <CardHeader>
          <Heading size="md">文字起こし結果</Heading>
        </CardHeader>
        <CardBody>
          {/* テキスト表示エリア */}
          <Box
            position="relative"
            minH="32"
            p={4}
            bg="gray.50"
            borderRadius="lg"
          >
            {/* ローディング表示 */}
            {isLoading && (
              <Flex
                position="absolute"
                inset={0}
                justify="center"
                align="center"
                bg="whiteAlpha.800"
                borderRadius="lg"
              >
                <Spinner
                  thickness="4px"
                  speed="0.65s"
                  color="blue.500"
                  size="xl"
                />
              </Flex>
            )}
            {/* テキスト表示 */}
            <Text color={text ? "gray.700" : "gray.500"}>
              {text || "録音を開始すると、ここに文字起こし結果が表示されます"}
            </Text>
          </Box>
        </CardBody>
      </Card>
    );
  }