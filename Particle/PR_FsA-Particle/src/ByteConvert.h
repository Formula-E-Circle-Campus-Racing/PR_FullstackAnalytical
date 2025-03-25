// ByteConvert.h
#ifndef BYTECONVERT_H
#define BYTECONVERT_H
#include <inttypes.h>

// :: Converts This only has one way conversion, from char* to the desired type
/**
 * @brief ByteConvert class
 * 
 * @details This class is used to convert a char* to a desired type.
 */
class ByteConvert{
    public:
        static bool toBool(char* data);
        static uint16_t toUShort(char* data);
        static double toDouble(char* data);
};
#endif