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
  import { useState } from "react";

  interface MinutesCardProps {
    text: string;      // 議事録テキスト
    disabled: boolean;
    onGenerate: () => Promise<void>;
  }
  
  export function MinutesCard({ 
    text, 
    onGenerate, 
    disabled 
  }: MinutesCardProps) {

    const [isGenerating, setIsGenerating] = useState(false);
    const [showMinutes, setShowMinutes] = useState(false);
  
    const handleGenerateClick = async () => {
      setIsGenerating(true);
      try {
        await onGenerate();
        setShowMinutes(true);
      } finally {
        setIsGenerating(false);
      }
    };

    return (
      <Card w="full">
        <CardHeader>
          <Flex justify="space-between" align="center">
            <Heading size="md">議事録生成</Heading>
            <Button
              colorScheme="blue"
              size="sm"
              onClick={handleGenerateClick}
              isDisabled={disabled || isGenerating}
              isLoading={isGenerating}
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
            {isGenerating && (
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
            <Text color={showMinutes && text ? "gray.700" : "gray.500"}>
                {showMinutes && text ? text : "生成ボタンを押すと、ここに議事録が表示されます"}
            </Text>
          </Box>
        </CardBody>
      </Card>
    );
  }