import {
    Card,
    CardHeader,
    CardBody,
    Heading,
    Button,
    Text,
    Box,
    Flex,
    Spinner,
  } from "@chakra-ui/react";
  
  interface MinutesCardProps {
    text: string;      // 議事録テキスト
    isLoading: boolean; // ローディング状態
    onGenerate: () => void; // 生成実行関数
    disabled: boolean;  // ボタン無効化状態
  }
  
  export function MinutesCard({ 
    text, 
    isLoading, 
    onGenerate, 
    disabled 
  }: MinutesCardProps) {
    return (
      <Card w="full">
        <CardHeader>
          <Flex justify="space-between" align="center">
            <Heading size="md">議事録生成</Heading>
            <Button
              colorScheme="blue"
              size="sm"
              onClick={onGenerate}
              isDisabled={disabled || isLoading}
            >
              生成
            </Button>
          </Flex>
        </CardHeader>
        <CardBody>
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
              {text || "生成ボタンを押すと、ここに議事録が表示されます"}
            </Text>
          </Box>
        </CardBody>
      </Card>
    );
  }