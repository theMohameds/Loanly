import React, { useState } from 'react';
import { View, Text, Animated } from 'react-native';
import MultiSlider from '@ptomasroos/react-native-multi-slider';

type PriceRangeSelectorProps = {
    min: number;
    max: number;
    step?: number;
    sliderLength?: number;
    value: [number, number];
    text?: string;
    onChange: (range: [number, number]) => void;
};

const PriceRangeSelector: React.FC<PriceRangeSelectorProps> = ({
    min,
    max,
    step = 100,
    sliderLength = 300,
    value,
    text,
    onChange,
}) => {
    const CustomMarker = ({ currentValue }: { currentValue: number }) => {
        const threshold = 0.98 * max;
        const bubbleWidth = `${currentValue}`.length * 10 + 16;
        const bubbleMargin = `${currentValue}`.length * 5;
        const finalBubbleMargin = currentValue >= threshold ? bubbleMargin : 0;

        return (
            <View style={{ alignItems: 'center' }}>
                <View
                    style={{
                        backgroundColor: '#3865e0ff',
                        width: bubbleWidth,
                        paddingVertical: 4,
                        borderRadius: 12,
                        marginBottom: 5,
                        minWidth: 40,
                        alignItems: 'center',
                        marginRight: finalBubbleMargin,
                    }}
                >
                    <Text style={{ color: 'white', fontWeight: 'bold' }}>
                        {text}{currentValue}
                    </Text>

                    <View
                        style={{
                            position: 'absolute',
                            marginLeft: finalBubbleMargin,
                            bottom: -4,
                            width: 0,
                            height: 0,
                            borderLeftWidth: 10,
                            borderRightWidth: 10,
                            borderTopWidth: 10,
                            borderLeftColor: 'transparent',
                            borderRightColor: 'transparent',
                            borderTopColor: '#3865e0ff',
                        }}
                    />
                </View>

                <View
                    style={{
                        width: 20,
                        height: 20,
                        borderRadius: 100,
                        backgroundColor: '#3865e0ff',
                        marginBottom: 31,
                    }}
                />
            </View>
        );
    };

    return (
        <View style={{ marginTop: 15, paddingHorizontal: 20 }}>
            <MultiSlider
                values={value}
                min={min}
                max={max}
                step={step}
                sliderLength={sliderLength}
                onValuesChange={vals => {
                    if (vals.length === 2) {
                        onChange([vals[0], vals[1]]);
                    }
                }}
                selectedStyle={{ backgroundColor: '#3865e0ff' }}
                unselectedStyle={{ backgroundColor: '#eee' }}
                containerStyle={{ height: 40 }}
                customMarker={CustomMarker}
            />
        </View>
    );
};

export default PriceRangeSelector;
