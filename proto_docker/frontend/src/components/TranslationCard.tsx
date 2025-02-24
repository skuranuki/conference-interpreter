import { 
  Card,
  CardHeader,
  CardBody,
  Heading,
  Select,
  Button,
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
  onTranslate: () => Promise<void>; // 翻訳処理用の関数を追加
}

export function TranslationCard({ 
  translatedEnglish, 
  translatedSpanish, 
  isLoading, 
  disabled,
  onTranslate 
}: TranslationCardProps) {

const [selectedLanguage, setSelectedLanguage] = useState("en");
const [showTranslation, setShowTranslation] = useState(false);
const [isTranslating, setIsTranslating] = useState(false);

// 選択された言語に応じた翻訳テキストを取得
const getTranslatedText = () => {
if (selectedLanguage === "en") return translatedEnglish;
if (selectedLanguage === "es") return translatedSpanish;
return "";
};

// 言語変更時の処理
const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedLanguage(e.target.value);
    setShowTranslation(false); // 言語変更時に翻訳表示をリセット
};

  // 翻訳ボタンクリック時の処理
const handleTranslateClick = async () => {
    setIsTranslating(true);
    try {
      await onTranslate();
      setShowTranslation(true);
    } finally {
      setIsTranslating(false);
    }
};

return (
    <Card w="full"
            transition="transform 0.2s"
            _hover={{ transform: 'scale(1.2)' }}
            cursor="pointer"
        >
      <CardHeader>
        <Flex justify="space-between" align="center">
          <Heading size="md">翻訳</Heading>
          <Flex gap={2} align="center">
            {/* 言語選択 */}
            <Select
                w="auto"
                size="sm"
                value={selectedLanguage}
                onChange={handleLanguageChange}
                // onChange={(e) => setSelectedLanguage(e.target.value)}
                isDisabled={disabled || isLoading}
            >
                <option value="en">英語</option>
                <option value="es">スペイン語</option>
            </Select>
            {/* ボタン */}
            <Button
                size="sm"
                colorScheme="blue"
                onClick={handleTranslateClick}
                isDisabled={disabled || isTranslating}
                isLoading={isTranslating}
                >
                翻訳
            </Button>
          </Flex>         
        </Flex>
      </CardHeader>

      <CardBody>
        <Box position="relative" minH="32" p={4} bg="gray.50" borderRadius="lg">
          {/* ローディング表示 */}
          {isTranslating && (
            <Flex position="absolute" inset={0} justify="center" align="center" bg="whiteAlpha.800" borderRadius="lg">
              <Spinner thickness="4px" speed="0.65s" color="blue.500" size="xl"/>
            </Flex>
          )}
          
          {/* テキスト表示 */}
          <Text color={showTranslation ? "gray.700" : "gray.500"}>
            {showTranslation 
              ? getTranslatedText() 
              : "翻訳ボタンを押して翻訳を表示"}
          </Text>
        </Box>
      </CardBody>
    </Card>  
);
}