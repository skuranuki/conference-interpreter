import { 
  Card,
  CardHeader,
  CardBody,
  Heading,
  Select,
  Text,
  Box,
  Flex,
  Spinner 
} from "@chakra-ui/react";
import { useState } from "react";

interface TranslationCardProps {
  translatedEnglish: string; // 英語翻訳テキスト
  translatedSpanish: string; // スペイン語翻訳テキスト
  isLoading: boolean;        // ローディング状態
  disabled: boolean;         // ボタン無効化状態
}

export function TranslationCard({ 
  translatedEnglish, 
  translatedSpanish, 
  isLoading, 
  disabled 
}: TranslationCardProps) {

const [selectedLanguage, setSelectedLanguage] = useState("en");

// 選択された言語に応じた翻訳テキストを取得
const getTranslatedText = () => {
if (selectedLanguage === "en") return translatedEnglish;
if (selectedLanguage === "es") return translatedSpanish;
return "";
};

return (
    <Card w="full">
      <CardHeader>
        <Flex justify="space-between" align="center">
          <Heading size="md">翻訳</Heading>
          {/* 言語選択 */}
          <Select
            w="auto"
            size="sm"
            value={selectedLanguage}
            onChange={(e) => setSelectedLanguage(e.target.value)}
            isDisabled={disabled || isLoading}
          >
            <option value="en">英語</option>
            <option value="es">スペイン語</option>
          </Select>
        </Flex>
      </CardHeader>

      <CardBody>
        <Box position="relative" minH="32" p={4} bg="gray.50" borderRadius="lg">
          {/* ローディング表示 */}
          {isLoading && (
            <Flex position="absolute" inset={0} justify="center" align="center" bg="whiteAlpha.800" borderRadius="lg">
              <Spinner thickness="4px" speed="0.65s" color="blue.500" size="xl"/>
            </Flex>
          )}
          
          {/* テキスト表示 */}
          {!isLoading && (
            <Text color={"gray.700"}>
              {getTranslatedText() || "ここに翻訳結果が表示されます"}
            </Text>
          )}
        </Box>
      </CardBody>

    </Card>  
);
}