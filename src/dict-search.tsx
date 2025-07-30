import { ReactElement, useEffect, useState } from 'react';
import { ActionPanel, Detail, Icons, List } from "@project-gauntlet/api/components";
import { useFetch } from '@project-gauntlet/api/hooks';
import { Clipboard } from "@project-gauntlet/api/helpers";
import { WordDefinition } from './types';
import open from './utils/open-link';

export default function Search(): ReactElement {
    const [searchDictWord, setSearchDictWord] = useState<string | undefined>("");
    const [words, setWords] = useState<string[]>([])
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [hoveredWord, setsetHoveredWord] = useState<string | undefined>("")


    const handleSearch = (value: string | undefined) => {
        console.log(`Searching for: ${value}`);
        setSearchDictWord(value);
        if (value) {
            setIsLoading(true);
            fetch(`https://api.datamuse.com/words?sp=${value}*`)
                .then(response => response.json())
                .then(data => setWords(data.map((item: any) => item.word)))
                .catch(error => {
                    console.error(`Failed to fetch words:`, error);
                })
                .finally(() => setIsLoading(false));
        } else {
            setWords([]);
        }
    }

    const { data: wordData, error: wordError, isLoading: wordIsLoading } = useFetch<WordDefinition>(
        hoveredWord ? "https://freedictionaryapi.com/api/v1/entries/en/" + encodeURIComponent(hoveredWord) : ""
    );

    useEffect(() => {
        console.log("Search word: " + searchDictWord)
        console.log("Selected word ID: " + hoveredWord)
    }, [searchDictWord, hoveredWord]);

    return (
        <List onItemFocusChange={setsetHoveredWord} isLoading={isLoading}
            actions={hoveredWord && wordData?.entries && wordData.entries.length > 0 && (
                <ActionPanel title="Meaning">
                    {wordData.entries.map((entry, index) => (
                        <ActionPanel.Action
                            key={index}
                            label={`Copy ${entry.partOfSpeech} definition`}
                            onAction={() => {
                                Clipboard.writeText(entry.senses?.[0]?.definition || "");
                                return { close: true };
                            }}
                        >
                        </ActionPanel.Action>
                    ))}
                    <ActionPanel.Section title='Other'>
                        {wordData.entries?.[0]?.pronunciations?.[0]?.text && (
                            <ActionPanel.Action
                                label='Copy pronunciation'
                                onAction={() => {
                                    Clipboard.writeText(wordData.entries[0].pronunciations[0].text);
                                    return { close: true };
                                }}
                            />
                        )}
                        <ActionPanel.Action
                            label={'Open in browser'}
                            onAction={(hoveredWord) => {
                                open(wordData.source.url);
                                return { close: true };
                            }}
                        />
                    </ActionPanel.Section>
                </ActionPanel>
            )}
        >
            <List.SearchBar
                placeholder="Search for a word..."
                value={searchDictWord}
                onChange={handleSearch}
            />
            {searchDictWord && words.length > 0 ? (
                words.slice(0, 10).map(word => (
                    <List.Item id={word} title={word} key={word} />
                ))
            ) : (
                null
            )}

            {isLoading ? (
                <List.EmptyView title='Searching...' />
            ) : !searchDictWord ? (
                <List.EmptyView title={`Search for word meanings`} />
            ) : (
                <List.EmptyView title='No results :(' image={Icons.Stop} />
            )}

            {searchDictWord && words.length > 0 && hoveredWord && (
                <WordDetail word={hoveredWord} data={wordData} error={wordError} isLoading={wordIsLoading} />
            )}
        </List>
    );
};

function WordDetail({
    word,
    data,
    error,
    isLoading,
}: {
    word: string | undefined;
    data: WordDefinition | undefined;
    error: any;
    isLoading: boolean;
}): ReactElement {
    return (
        <List.Detail isLoading={isLoading}>
            <List.Detail.Content>
                { isLoading ? (
                    <List.Detail.Content.Paragraph>Loading...</List.Detail.Content.Paragraph>
                ) : error ? (
                    <List.Detail.Content.Paragraph>Error loading definition</List.Detail.Content.Paragraph>
                ) : !data?.entries?.length ? (
                    <List.Detail.Content.Paragraph>No definition found for "{word}"</List.Detail.Content.Paragraph>
                ) : (
                    <>
                        <List.Detail.Content.H4>{word}  —  {data.entries?.[0].pronunciations[0]?.text || "No pronunciation available"}</List.Detail.Content.H4>
                        {data.entries.map((entry, index) => (
                            <>
                                <List.Detail.Content.H6 key={index}>
                                    {entry.partOfSpeech}
                                </List.Detail.Content.H6>
                                <List.Detail.Content.Paragraph>
                                    {entry.senses.map((sense, index) => `${index + 1}.  ${sense.definition}`).join('\n')}
                                </List.Detail.Content.Paragraph>
                            </>
                        ))}
                        <List.Detail.Content.HorizontalBreak />
                        <List.Detail.Content.Paragraph>
                            Source: {data?.source.url} ({data?.source.license.name})
                        </List.Detail.Content.Paragraph>
                    </>
                )}
            </List.Detail.Content>
        </List.Detail>
    );
}