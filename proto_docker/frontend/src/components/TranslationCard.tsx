import {
    Card,
    CardHeader,
    CardBody,
    Heading,
    Button,
    Select,
    Text,
    Box,
    Flex,
    Spinner,
  } from "@chakra-ui/react";
  
  interface TranslationCardProps {
    text: string;      // 翻訳テキスト
    isLoading: boolean; // ローディング状態
    onTranslate: (lang: string) => void; // 翻訳実行関数
    disabled: boolean;  // ボタン無効化状態
  }
  
  export function TranslationCard({ 
    text, 
    isLoading, 
    onTranslate, 
    disabled 
  }: TranslationCardProps) {
    return (
      <Card w="full">
        <CardHeader>
          <Flex justify="space-between" align="center">
            <Heading size="md">翻訳</Heading>
            {/* 言語選択と翻訳ボタン */}
            <Flex gap={2}>
              <Select
                w="auto"
                size="sm"
                defaultValue="en"
              >
                <option value="en">英語</option>
                <option value="zh">中国語</option>
                <option value="ko">韓国語</option>
              </Select>
              <Button
                colorScheme="blue"
                size="sm"
                onClick={() => onTranslate('en')}
                isDisabled={disabled || isLoading}
              >
                翻訳
              </Button>
            </Flex>
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
              {text || "翻訳ボタンを押すと、ここに翻訳結果が表示されます"}
            </Text>
          </Box>
        </CardBody>
      </Card>
    );
  }